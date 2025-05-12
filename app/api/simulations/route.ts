import { NextRequest, NextResponse } from "next/server";
import prisma from "@/data/db";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { simulationName, kpis, bottlenecks } = data;
    // simulationName: string
    // kpis: array of { key: string; value: number; name?: string }
    // bottlenecks: array of { tick: number; name: string }

    // 1) Create the SimulationRecord
    const newSim = await prisma.simulationRecord.create({
      data: {
        name: simulationName,
      },
    });

    // 2) Create KpiRecords
    if (Array.isArray(kpis)) {
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
    }

    // 3) Create BottleneckRecords
    if (Array.isArray(bottlenecks)) {
      for (const b of bottlenecks) {
        console.log("Bottleneck:", b);
        await prisma.bottleneckRecord.create({
          data: {
            tick: b.tick,
            name: b.name,
            simulationId: newSim.id,
          },
        });
      }
    }

    return NextResponse.json({ success: true, simulationId: newSim.id });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
