import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: NextRequest) {
    try {
        const { metrics } = await request.json();

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json(
                { error: "Server configuration error: API Key missing" },
                { status: 500 }
            );
        }

        const prompt = `
    You are a Supply Chain Sustainability Expert.
    
    Analyze the following carbon footprint metrics for an import/export business:
    - Total CO2 Emissions: ${metrics.totalEmissions} tons
    - Green Score: ${metrics.greenScore}/100
    - Potential Savings: ${metrics.potentialSavings} tons
    - Top Emitting Countries: ${JSON.stringify(Object.entries(metrics.emissionsByCountry).sort(([, a]: any, [, b]: any) => b - a).slice(0, 3))}
    - Top Emitting Products: ${JSON.stringify(Object.entries(metrics.emissionsByProduct).sort(([, a]: any, [, b]: any) => b - a).slice(0, 3))}

    Provide 3 specific, actionable, and high-impact recommendations to reduce their carbon footprint.
    Focus on logistics optimization, mode switching (Air to Sea), or sourcing changes.
    
    Return a STRICT JSON array of objects:
    [
      {
        "title": "Short title of recommendation",
        "impact": "Estimated CO2 savings (e.g., 'Save ~15 tons')",
        "description": "One sentence explanation."
      },
      ...
    ]
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let recommendations;
        try {
            const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
            recommendations = JSON.parse(cleaned);
        } catch (e) {
            console.error("Failed to parse AI recommendations:", text);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        return NextResponse.json({ recommendations });

    } catch (err: any) {
        console.error("Error generating sustainability tips:", err);
        return NextResponse.json(
            { error: err.message || "Failed to generate tips" },
            { status: 500 }
        );
    }
}
