import { Title } from "@mantine/core";

import { LocationsTable } from "@/components/crud/LocationsTable";
import prisma from "@/data/db";
import { create, del, update } from "./actions";

export default async function Locations() {
  const locations = await prisma.location.findMany();

  return (
    <>
      <Title>Locations</Title>
      <LocationsTable
        data={locations}
        create={create}
        remove={del}
        update={update}
      />
    </>
  );
}
