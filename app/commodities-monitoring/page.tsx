"use client";

import { Flex, Paper, SimpleGrid, Table, Text, Title } from "@mantine/core";
import { FC, ReactNode, useEffect } from "react";

import { useSimulation } from "@/components/SimulationContext";
import { Prisma } from "@prisma/client";
import { groupInventory } from "../incoming-goods/helpers";

interface LocationCardProps {
  name: ReactNode;
  processSteps: Prisma.ProcessStepGetPayload<{
    include: { inventory: { include: { entries: true } } };
  }>[];
}

const LocationCard: FC<LocationCardProps> = ({ name, processSteps }) => (
  <Paper shadow="sm" p="lg">
    <Text fw="bold" size="lg" mb="md">
      {name}
    </Text>
    {processSteps.map((ps) => (
      <>
        <Text fw="bold">{ps.name}</Text>
        <Table withTableBorder>
          <Table.Thead>
            <Table.Tr>
              <Flex gap="md" justify="space-between" align="flex-start" direction="row" wrap="nowrap">
                <Table.Th>Material</Table.Th>
                <Table.Th>Count</Table.Th>
              </Flex>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {Object.entries(groupInventory(ps.inventory)).map(
              ([material, count]) => (
                <Table.Tr key={material}>
                  <Flex gap="md" justify="space-between" align="flex-start" direction="row" wrap="nowrap">
                    <Table.Td>{material}</Table.Td>
                    <Table.Td>{count}</Table.Td>
                  </Flex>
                </Table.Tr>
              )
            )}
          </Table.Tbody>
        </Table>
      </>
    ))}
  </Paper>
);

export default function CommoditiesMonitoring() {
  const { simulation, frame } = useSimulation();

  useEffect(() => {
    console.log(simulation);
  }, [simulation]);

  return (
    <>
      <Title>Commodities</Title>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {simulation?.frames[frame].locations.map((l) => (
          <LocationCard
            key={l.id}
            name={l.name}
            processSteps={l.processSteps}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
