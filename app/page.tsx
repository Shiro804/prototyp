import { SimpleGrid, Title } from "@mantine/core";

import { StatCard } from "@/components/Stats";
import prisma from "@/data/db";

export default async function Dashboard() {
  const locations = await prisma.location.count();
  const resources = await prisma.resource.count();
  const transportSystems = await prisma.transportSystem.count();

  return (
    <>
      <Title>Dashboard</Title>
      <SimpleGrid cols={{ base: 2, md: 3 }}>
        <StatCard title="Locations" value={locations} />
        <StatCard title="Resources" value={resources} />
        <StatCard title="Transport Systems" value={transportSystems} />
      </SimpleGrid>
    </>
  );
}
