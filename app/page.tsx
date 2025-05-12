import { Flex, rem, SimpleGrid, Tabs, Title, TabsList, TabsPanel, TabsTab, Container } from "@mantine/core";

import { StatCard } from "@/components/StatCard";
import prisma from "@/data/db";
import { IconDice1, IconDice2, IconDice3 } from "@tabler/icons-react";
import KpiLive from "@/components/KPI/KPILive";

export default async function Dashboard() {
  const locations = await prisma.location.count();
  const resources = await prisma.resource.count();
  const machines = await prisma.machine.count();
  const transportSystems = await prisma.transportSystem.count();
  const sensors = await prisma.sensor.count();
  const workers = await prisma.worker.count();
  const pSteps = await prisma.processStep.count();

  const iconStyle = { width: rem(12), height: rem(12) };

  return (
    // <Container __size="xl" ml={0}>
    //   <Title>Dashboard</Title>
    //   <Flex w="1300px" h="1000px" gap="md" direction="column">
    //     <Tabs defaultValue="view1">
    //       <TabsList>
    //         <TabsTab value="view1" leftSection={<IconDice1 style={iconStyle} />}>
    //           View 1
    //         </TabsTab>
    //         <TabsTab value="view2" leftSection={<IconDice2 style={iconStyle} />}>
    //           View 2
    //         </TabsTab>
    //         <TabsTab value="view3" leftSection={<IconDice3 style={iconStyle} />}>
    //           View 3
    //         </TabsTab>
    //       </TabsList>
    //       <TabsPanel w="100%" h="100%" value="view1">
    //         <SimpleGrid pt="20px" cols={{ base: 1, md: 3 }}>
    //           <StatCard title="Locations" value={locations} />
    //           <StatCard title="Resources" value={resources} />
    //           <StatCard title="Transport Systems" value={transportSystems} />
    //           <StatCard title="Machines" value={machines} />
    //           <StatCard title="Sensors" value={sensors} />
    //           <StatCard title="Workers" value={workers} />
    //           <StatCard title="Process Steps" value={pSteps} />
    //         </SimpleGrid>
    //       </TabsPanel>

    //       <TabsPanel value="view2">
    //         <SimpleGrid pt="20px" cols={{ base: 1, md: 3 }}>
    //           <StatCard title="Locations" value={locations} height="500px" />
    //           <StatCard title="Resources" value={resources} height="500px" />
    //           <StatCard title="Transport Systems" value={transportSystems} height="500px" />
    //           <StatCard title="Machines" value={machines} height="500px" />
    //           <StatCard title="Sensors" value={sensors} height="500px" />
    //           <StatCard title="Workers" value={workers} height="500px" />
    //           <StatCard title="Process Steps" value={pSteps} height="500px" />
    //         </SimpleGrid>
    //       </TabsPanel>

    //       <TabsPanel value="view3">
    //         <SimpleGrid pt="20px" cols={{ base: 1, md: 1 }}>
    //           <StatCard title="Locations" value={locations} height="500px" />
    //           <StatCard title="Resources" value={resources} height="500px" />
    //           <StatCard title="Transport Systems" value={transportSystems} height="500px" />
    //           <StatCard title="Machines" value={machines} height="500px" />
    //           <StatCard title="Sensors" value={sensors} height="500px" />
    //           <StatCard title="Workers" value={workers} height="500px" />
    //           <StatCard title="Process Steps" value={pSteps} height="500px" />
    //         </SimpleGrid>
    //       </TabsPanel>
    //     </Tabs>

    //   </Flex>
    // </Container>
    <KpiLive />
  );
}
