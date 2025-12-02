import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify ownership
        const dataset = await prisma.dataset.findUnique({
            where: { id }
        });

        if (!dataset || dataset.userId !== user.id) {
            return NextResponse.json({ error: "Dataset not found or unauthorized" }, { status: 404 });
        }

        await prisma.dataset.delete({
            where: { id }
        });

        return NextResponse.json({ message: "Dataset deleted" });
    } catch (error) {
        console.error("Delete dataset error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
