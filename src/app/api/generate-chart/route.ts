import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: NextRequest) {
  try {
    const { description, data } = await request.json();

    if (!description || !data || !Array.isArray(data) || data.length === 0) {
      return NextResponse.json(
        { error: "Description and valid data array are required" },
        { status: 400 }
      );
    }

    // 1. Analyze Data Structure
    const columns = Object.keys(data[0]);
    const sampleRow = data[0];
    const dataSummary = columns.map(col => `${col} (${typeof sampleRow[col]})`).join(", ");

    // 2. Prompt for Gemini to get a "Chart Plan"
    const prompt = `
    You are a data visualization expert.
    User Request: "${description}"
    
    Data Columns: ${dataSummary}
    Sample Data (first 3 rows):
    ${JSON.stringify(data.slice(0, 3), null, 2)}

    Based on the user's request and the data structure, determine the best way to visualize this.
    
    CRITICAL INSTRUCTION FOR UNREASONABLE REQUESTS:
    If the user's request CANNOT be answered by the provided data columns (e.g., asking for "weather", "stock prices", "Mars population" when data is about imports), or if the request is nonsensical:
    Return a JSON with "error" field explaining why.
    Example: { "error": "The dataset does not contain information about weather. It only has: port, product, value, etc." }

    Otherwise, return a STRICT JSON object with the following fields (no markdown, no explanations):
    {
      "chartType": "bar" | "line" | "pie" | "scatter" | "histogram",
      "xColumn": "name of the column for X axis (or labels)",
      "yColumn": "name of the column for Y axis (or values)",
      "aggregation": "sum" | "count" | "average" | "none",
      "title": "Chart Title",
      "xAxisLabel": "Label for X axis",
      "yAxisLabel": "Label for Y axis",
      "colors": ["hex code 1", "hex code 2"] (optional custom colors, use professional palette)
    }
    
    Rules:
    - If the user asks for a count of items, use "count" aggregation.
    - If the user asks for total/sum, use "sum".
    - If "pie" chart, xColumn is the label (category) and yColumn is the value.
    - If "scatter", usually "none" aggregation unless grouping is implied.
    `;

    // 3. Call Gemini
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("GOOGLE_API_KEY is not set");
    }

    // Use gemini-flash-latest as a stable alias for the latest flash model
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // 4. Parse Gemini Response
    let plan;
    try {
      const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
      plan = JSON.parse(cleaned);

      if (plan.error) {
        return NextResponse.json({ error: plan.error }, { status: 400 });
      }
    } catch (e) {
      console.error("Failed to parse Gemini response:", text);
      throw new Error("AI returned invalid JSON plan");
    }

    // 5. Execute Aggregation Logic (The "Smart" Part)
    let processedData = { x: [] as any[], y: [] as any[] };

    if (plan.aggregation === "none") {
      processedData.x = data.map(row => row[plan.xColumn]);
      processedData.y = data.map(row => row[plan.yColumn]);
    } else {
      // Group by xColumn
      const groups: Record<string, number[]> = {};

      data.forEach(row => {
        const key = String(row[plan.xColumn] || "Unknown");
        const val = parseFloat(row[plan.yColumn]) || 0;

        if (!groups[key]) groups[key] = [];
        groups[key].push(val);
      });

      // Aggregate
      const keys = Object.keys(groups);
      processedData.x = keys;
      processedData.y = keys.map(key => {
        const values = groups[key];
        if (plan.aggregation === "sum") return values.reduce((a, b) => a + b, 0);
        if (plan.aggregation === "average") return values.reduce((a, b) => a + b, 0) / values.length;
        if (plan.aggregation === "count") return values.length; // For count, we often ignore yColumn values and just count rows
        return 0;
      });

      // Special case for count: if aggregation is count, we might not need yColumn values, 
      // but the loop above assumes we are aggregating *something*. 
      // If aggregation is 'count', we should just count occurrences of xColumn keys.
      if (plan.aggregation === "count") {
        const counts: Record<string, number> = {};
        data.forEach(row => {
          const key = String(row[plan.xColumn] || "Unknown");
          counts[key] = (counts[key] || 0) + 1;
        });
        processedData.x = Object.keys(counts);
        processedData.y = Object.values(counts);
      }
    }

    // Sort data for better visualization (optional, but good for bars)
    if (plan.chartType === 'bar' || plan.chartType === 'pie') {
      // Create pairs, sort by Y desc, unzip
      const pairs = processedData.x.map((x, i) => ({ x, y: processedData.y[i] }));
      pairs.sort((a, b) => (b.y as number) - (a.y as number));
      // Limit to top 20 to avoid overcrowding
      const top20 = pairs.slice(0, 20);
      processedData.x = top20.map(p => p.x);
      processedData.y = top20.map(p => p.y);
    }

    // 6. Construct Plotly Config
    const chartConfig = {
      data: [{
        type: plan.chartType,
        x: plan.chartType === 'pie' ? undefined : processedData.x,
        y: plan.chartType === 'pie' ? undefined : processedData.y,
        // Pie chart specific
        labels: plan.chartType === 'pie' ? processedData.x : undefined,
        values: plan.chartType === 'pie' ? processedData.y : undefined,
        marker: {
          color: plan.colors || undefined
        }
      }],
      layout: {
        title: plan.title,
        xaxis: { title: plan.xAxisLabel, automargin: true },
        yaxis: { title: plan.yAxisLabel, automargin: true },
        template: "plotly_white",
        height: 450
      }
    };

    return NextResponse.json({ config: chartConfig });

  } catch (err: any) {
    console.error("Error generating chart:", err);
    return NextResponse.json(
      { error: err.message || "Failed to generate chart" },
      { status: 500 }
    );
  }
}