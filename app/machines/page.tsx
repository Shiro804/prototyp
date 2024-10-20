import { Title } from "@mantine/core";

import prisma from "@/data/db";
import { create, del, update } from "./actions";
import { MachinesTable } from "@/components/crud/MachinesTable";

export default async function Machines() {
  const machines = await prisma.machine.findMany();

  return (
    <>
      <Title>Machines</Title>
      <MachinesTable
        data={machines}
        create={create}
        remove={del}
        update={update}
      />
    </>
  );
}
