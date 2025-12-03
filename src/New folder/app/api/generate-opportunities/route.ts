import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: NextRequest) {
    try {
        const { products } = await request.json();

        if (!products || products.length === 0) {
            return NextResponse.json(
                { error: "No products provided for analysis" },
                { status: 400 }
            );
        }

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json(
                { error: "Server configuration error: API Key missing" },
                { status: 500 }
            );
        }

        const prompt = `
    You are a Global Trade Analyst and Market Researcher.
    
    Task: Identify the top 3 high-demand international markets (countries) for export for EACH of the following products:
    ${products.join(", ")}

    For each opportunity, provide:
    1. Target Country
    2. Estimated Price Premium (percentage higher than global average)
    3. Key Demand Driver (why is it in demand there?)
    4. A brief strategy tip.

    Return a STRICT JSON array of objects in this format:
    [
      {
        "product": "Product Name",
        "opportunities": [
          {
            "country": "Country Name",
            "flag": "Country Code (2 letter ISO, e.g. US, AE)",
            "premium": "e.g. +15%",
            "reason": "Short explanation of demand",
            "strategy": "One tip for entering this market"
          },
          ... (2 more countries)
        ]
      },
      ... (for other products)
    ]
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        let opportunities;
        try {
            const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
            opportunities = JSON.parse(cleaned);
        } catch (e) {
            console.error("Failed to parse AI opportunities:", text);
            return NextResponse.json({ error: "Failed to parse AI response" }, { status: 500 });
        }

        return NextResponse.json({ opportunities });

    } catch (err: any) {
        console.error("Error generating arbitrage opportunities:", err);
        return NextResponse.json(
            { error: err.message || "Failed to generate opportunities" },
            { status: 500 }
        );
    }
}
