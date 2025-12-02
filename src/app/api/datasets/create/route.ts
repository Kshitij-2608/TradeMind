import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { name, records } = await request.json();

        if (!records || !Array.isArray(records) || records.length === 0) {
            return NextResponse.json({ error: "No records provided" }, { status: 400 });
        }

        // Free tier limit: Max 500 records per dataset
        if (records.length > 500) {
            return NextResponse.json({
                error: "Free tier limit exceeded. Max 500 records per dataset."
            }, { status: 400 });
        }

        // Find or create user in DB
        let user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            user = await prisma.user.create({
                data: {
                    email: session.user.email,
                    name: session.user.name,
                    image: session.user.image
                }
            });
        }

        // Check total datasets limit (e.g., max 5 for free tier)
        const datasetCount = await prisma.dataset.count({
            where: { userId: user.id }
        });

        if (datasetCount >= 5) {
            return NextResponse.json({
                error: "Dataset limit reached (Max 5). Please delete old datasets."
            }, { status: 400 });
        }

        // Create dataset and records transactionally
        const dataset = await prisma.dataset.create({
            data: {
                name: name || `Dataset ${new Date().toISOString().split('T')[0]}`,
                userId: user.id,
                records: {
                    create: records.map((r: any) => ({
                        date: r.Date || r.date,
                        shipmentId: r.Shipment_ID || r.shipment_id,
                        product: r.Product || r.product,
                        quantity: Number(r.Quantity || r.quantity) || 0,
                        pricePerUnit: Number(r.Price_per_unit || r.price_per_unit) || 0,
                        currency: r.Currency || r.currency,
                        totalValue: Number(r.Total_Value || r.total_value || r.assessable_value) || 0,
                        port: r.Port || r.port,
                        countryOfOrigin: r.Country_of_Origin || r.country_of_origin,
                        importerName: r.Importer_Name || r.importer_name,
                        exporterName: r.Exporter_Name || r.exporter_name,
                        hsCode: r.HS_Code || r.hs_code,
                        rawData: r // Store full object just in case
                    }))
                }
            }
        });

        return NextResponse.json({
            success: true,
            datasetId: dataset.id,
            message: `Saved ${records.length} records to cloud.`
        });

    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json({ error: error.message || "Failed to save dataset" }, { status: 500 });
    }
}
