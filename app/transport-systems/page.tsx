import { Title } from "@mantine/core";

import { LocationsTable } from "@/components/crud/LocationsTable";
import prisma from "@/data/db";
import { create, del, update } from "./actions";
import { TransportSystemsTable } from "@/components/crud/TransportSystemsTable";

export default async function Locations() {
  const transportSystems = await prisma.transportSystem.findMany();

  return (
    <>
      <Title>Transport Systems</Title>
      <TransportSystemsTable
        data={transportSystems}
        create={create}
        remove={del}
        update={update}
      />
    </>
  );
}
