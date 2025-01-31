import { Title } from "@mantine/core";

import prisma from "@/data/db";
import { create, del, update } from "./actions";
import { SimulationRecordsTable } from "@/components/crud/SimulationRecordsTable";

export default async function SimulationAnalysis() {
  const simulationAnalysis = await prisma.simulationRecord.findMany();

  return (
    <>
      <Title>Simulation Records</Title>
      <SimulationRecordsTable
        data={simulationAnalysis}
        create={create}
        remove={del}
        update={update}
      />
    </>
  );
}
