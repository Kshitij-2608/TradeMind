import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ datasets: [] });
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

        return NextResponse.json({ datasets });

    } catch (error: any) {
        console.error("Fetch datasets error:", error);
        return NextResponse.json({ error: "Failed to fetch datasets" }, { status: 500 });
    }
}
