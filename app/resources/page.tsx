import { Title } from "@mantine/core";

import { LocationsTable } from "@/components/crud/LocationsTable";
import prisma from "@/data/db";
import { create, del, update } from "./actions";
import { ResourcesTable } from "@/components/crud/ResourcesTable";

export default async function Locations() {
  const resources = await prisma.resource.findMany();

  return (
    <>
      <Title>Resources</Title>
      <ResourcesTable
        data={resources}
        create={create}
        remove={del}
        update={update}
      />
    </>
  );
}
