import { Title } from "@mantine/core";

import { CrudTable } from "@/components/CrudTable";
import prisma from "@/data/db";
import { redirect } from "next/navigation";

export default async function Locations() {
  const locations = await prisma.location.findMany();

  const onAdd = () => {
    redirect("./create");
  };

  return (
    <>
      <Title>Locations</Title>
      <CrudTable
        header={["ID", "Name", "Description", "Created at", "Updated at"]}
        data={locations}
        props={["id", "name", "description", "createdAt", "updatedAt"]}
        editBaseUrl="/locations"
        onAdd={onAdd}
      />
    </>
  );
}
