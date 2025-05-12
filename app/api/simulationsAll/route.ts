"use server";

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const simId = searchParams.get("simId");

    // 1) If no simId => return ALL SimulationRecords
    if (!simId) {
      const sims = await prisma.simulationRecord.findMany({
        orderBy: { createdAt: "desc" },
      });
      return NextResponse.json({ success: true, simulations: sims });
    }

    // 2) If simId => get that sim's KPIs and Bottlenecks
    const parseId = parseInt(simId, 10);
    if (isNaN(parseId)) {
      return NextResponse.json({ success: false, error: "Invalid simId" });
    }

    // Fetch KPI records
    const kpis = await prisma.kpiRecord.findMany({
      where: { simulationId: parseId },
      orderBy: { createdAt: "asc" },
    });

    // Fetch Bottleneck records
    const bottlenecks = await prisma.bottleneckRecord.findMany({
      where: { simulationId: parseId },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({
      success: true,
      kpis,
      bottlenecks,
      simulation: parseId, // or you can add whatever info you want
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
