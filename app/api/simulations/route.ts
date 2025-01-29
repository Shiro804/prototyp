import { NextRequest, NextResponse } from "next/server";
import prisma from "@/data/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { simulationName, kpis } = data;
    // simulationName: string
    // kpis: array of { key: string; value: number }

    // 1) Create the SimulationRecord
    const newSim = await prisma.simulationRecord.create({
      data: {
        name: simulationName,
      },
    });

    // 2) Create KpiRecords
    // e.g. kpis = [{ key: "pendingCount", value: 5 }, ...]
    for (const k of kpis) {
      await prisma.kpiRecord.create({
        data: {
          key: k.key,
          value: k.value,
          name: k.name,
          simulationId: newSim.id,
        },
      });
    }

    return NextResponse.json({ success: true, simulationId: newSim.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: error }, { status: 500 });
  }
}
