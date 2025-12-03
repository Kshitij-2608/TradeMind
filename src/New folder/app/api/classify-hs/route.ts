import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: NextRequest) {
    try {
        const { description } = await request.json();

        if (!description) {
            return NextResponse.json(
                { error: "Product description is required" },
                { status: 400 }
            );
        }

        if (!process.env.GOOGLE_API_KEY) {
            return NextResponse.json(
                { error: "Server configuration error: API Key missing" },
                { status: 500 }
            );
        }

        // Prompt for Gemini
        const prompt = `
    You are an expert Customs Broker and Trade Compliance Specialist for India.
    
    Task: Classify the following product and provide the HS Code (Harmonized System Code) and estimated duty details for import into India.

    Product Description: "${description}"

    Return a STRICT JSON object with the following fields (no markdown, no explanations outside JSON):
    {
      "hs_code": "The most likely 6 or 8 digit HS Code",
      "title": "Official or standard description for this HS Code",
      "duty_rate": "Estimated Basic Customs Duty (BCD) percentage (e.g., '10%')",
      "gst_rate": "Estimated IGST percentage (e.g., '18%')",
      "reasoning": "A brief explanation of why this code was chosen based on the description",
      "compliance_notes": "Any specific import restrictions, BIS requirements, or certifications needed (optional)"
    }
    `;

        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // Parse JSON
        let classification;
        try {
            const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
            classification = JSON.parse(cleaned);
        } catch (e) {
            console.error("Failed to parse Gemini response:", text);
            return NextResponse.json(
                { error: "Failed to parse AI response" },
                { status: 500 }
            );
        }

        return NextResponse.json(classification);

    } catch (err: any) {
        console.error("Error classifying product:", err);
        return NextResponse.json(
            { error: err.message || "Failed to classify product" },
            { status: 500 }
        );
    }
}
