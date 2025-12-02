import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: NextRequest) {
    try {
        const { focus, data } = await request.json();

        if (!data || data.length === 0) {
            return NextResponse.json(
                { error: "No data provided for report generation" },
                { status: 400 }
            );
        }

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json(
                { error: "Server configuration error: API Key missing" },
                { status: 500 }
            );
        }

        // Prepare data summary (first 50 rows to avoid token limits, or aggregate if needed)
        // For a report, we might want to send a summarized version or a sample.
        // Let's send a sample of 50 rows and column headers.
        const dataSample = data.slice(0, 50);
        const columns = Object.keys(data[0]).join(", ");

        // Prompt for Gemini
        const prompt = `
    You are a Senior Trade Analyst and Data Scientist.
    
    Task: Generate a comprehensive, professional Trade Intelligence Report based on the provided dataset.
    
    User Focus Area: "${focus || "General Overview"}"
    
    Dataset Columns: ${columns}
    Sample Data (first 50 rows):
    ${JSON.stringify(dataSample, null, 2)}
    
    Total Records in Dataset: ${data.length}

    Instructions:
    1. Analyze the provided sample data to identify trends, anomalies, and key insights.
    2. Focus specifically on the user's requested area: "${focus}".
    3. Structure the report in Markdown format with the following sections:
       - **Executive Summary**: High-level overview of the findings.
       - **Key Trends**: Bullet points of major patterns observed (e.g., top ports, rising products).
       - **Focus Analysis**: Deep dive into the "${focus}" aspect.
       - **Strategic Recommendations**: Actionable advice for the business based on this data.
    
    Tone: Professional, analytical, and concise. Use bolding for key metrics.
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const report = response.text();

        return NextResponse.json({ report });

    } catch (err: any) {
        console.error("Error generating report:", err);
        return NextResponse.json(
            { error: err.message || "Failed to generate report" },
            { status: 500 }
        );
    }
}
