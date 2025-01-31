"use server";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const simId = searchParams.get("simId");

    // 1) Wenn kein simId => ALLE SimulationRecords
    if (!simId) {
      const sims = await prisma.simulationRecord.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, simulations: sims });
    }

    // 2) Wenn simId => hole KPIs
    const parseId = parseInt(simId, 10);
    if (isNaN(parseId)) {
      return NextResponse.json({ success: false, error: "Invalid simId" });
    }

    const kpis = await prisma.kpiRecord.findMany({
      where: { simulationId: parseId },
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json({ success: true, kpis });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
