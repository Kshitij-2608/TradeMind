import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, records } = await req.json();
        if (!name || !records || !Array.isArray(records)) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const dataset = await prisma.dataset.create({
            data: {
                name,
                userId: user.id,
                records: {
                    create: records.map((record: any) => ({
                        date: record.Date || record.date || new Date().toISOString(),
                        product: record.Product || record.product || "Unknown",
                        quantity: Number(record.Quantity || record.quantity) || 0,
                        totalValue: Number(record.Total_Value || record.totalValue || record.assessable_value) || 0,
                        port: record.port || "Unknown",
                        countryOfOrigin: record.country_of_origin || "Unknown",
                        rawData: record
                    }))
                }
            }
        });

        return NextResponse.json({ message: "Dataset saved successfully", id: dataset.id }, { status: 201 });
    } catch (error) {
        console.error("Save dataset error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
