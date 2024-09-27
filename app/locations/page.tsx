import { Title } from "@mantine/core";

import { CrudTable } from "@/components/CrudTable";
import prisma from "@/data/db";
import { CreateLocationModal } from "@/components/modals/CreateLocation";
import { create, del } from "./actions";

export default async function Locations() {
  const locations = await prisma.location.findMany();

  return (
    <>
      <Title>Locations</Title>
      <CrudTable
        header={["ID", "Name", "Description", "Created at", "Updated at"]}
        data={locations}
        props={["id", "name", "description", "createdAt", "updatedAt"]}
        editBaseUrl="/locations"
        convertToString={["createdAt", "updatedAt"]}
        onDelete={del}
      />
      <CreateLocationModal onSubmit={create} />
    </>
  );
}
