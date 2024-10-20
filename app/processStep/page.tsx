import { Title } from "@mantine/core";

import prisma from "@/data/db";
import { create, del, update } from "./actions";
import { ProcessStepsTable } from "@/components/crud/ProcessStepsTable";

export default async function ProcessSteps() {
  const processStep = await prisma.processStep.findMany();

  return (
    <>
      <Title>Process Steps</Title>
      <ProcessStepsTable
        data={processStep}
        create={create}
        remove={del}
        update={update}
      />
    </>
  );
}
