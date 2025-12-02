import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const datasets = await prisma.dataset.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' },
            include: {
                _count: {
                    select: { records: true }
                }
            }
        });

        return NextResponse.json(datasets);
    } catch (error) {
        console.error("Fetch datasets error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
