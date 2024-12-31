"use client";

import { Flex, Paper, SimpleGrid, Table, Text, Title, Switch } from "@mantine/core";
import { FC, ReactNode, useEffect } from "react";
import { Prisma, TransportSystem } from "@prisma/client";
import { groupInventory } from "../incoming-goods/helpers";
import { useSimulationMock } from "@/components/SimulationContextMock";
import { LocationFull } from "@/lib/simulation/simulationMock";

interface MonitoringCardProps {
  name: ReactNode;
  processSteps: Prisma.ProcessStepGetPayload<{
    include: { inventory: { include: { entries: true } } };
  }>[];
  transportSystems: TransportSystem[]; // neu
}

const MonitoringCard: FC<MonitoringCardProps> = ({
  name,
  processSteps,
  transportSystems,
}) => {
  const { toggleTransportSystem } = useSimulationMock();

  return (
    <Paper shadow="sm" p="lg" h={"600px"} style={{ overflowY: "auto" }}>
      <Text fw="bold" size="lg" mb="md">
        {name}
      </Text>
      {/* ProcessSteps-Inventare */}
      {processSteps
        .slice() // damit reverse() nicht das Original-Array ändert
        .reverse()
        .map((ps) => (
          <div key={ps.id} style={{ marginBottom: "2rem" }}>
            <Text fw={600}>{ps.name}</Text>
            <Table withTableBorder>
              <Table.Thead>
                <Table.Tr>
                  <Flex
                    gap="md"
                    justify="space-between"
                    align="flex-start"
                    direction="row"
                    wrap="nowrap"
                  >
                    <Table.Th fw={600}>Material</Table.Th>
                    <Table.Th fw={600}>Count</Table.Th>
                  </Flex>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {Object.entries(groupInventory([ps.inventory])).map(
                  ([material, count]) => (
                    <Table.Tr key={material}>
                      <Flex
                        gap="md"
                        justify="space-between"
                        align="flex-start"
                        direction="row"
                        wrap="nowrap"
                      >
                        <Table.Td fw={600}>{material}</Table.Td>
                        <Table.Td fw={600}>{count}</Table.Td>
                      </Flex>
                    </Table.Tr>
                  ),
                )}
              </Table.Tbody>
            </Table>
          </div>
        ))}

      {/* Transport Systems */}
      {transportSystems.length > 0 && (
        <>
          <Text fw="bold" mt="lg" mb="sm">
            Transport Systems
          </Text>
          <Table withTableBorder>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Name</Table.Th>
                <Table.Th>Active</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {transportSystems.map((ts) => (
                <Table.Tr key={ts.id}>
                  <Table.Td>{ts.name}</Table.Td>
                  <Table.Td>
                    <Switch
                      checked={ts.active}
                      onChange={() => toggleTransportSystem(ts.id)}
                    />
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </>
      )}
    </Paper>
  );
};

export default function Monitoring() {
  const { simulation, frame } = useSimulationMock();

  function getTransportSystemsForLocation(
    location: LocationFull
  ): TransportSystem[] {
    // Sammle alle TS aus allen ProcessSteps dieser Location
    const tsSet = new Map<number, TransportSystem>();

    for (const ps of location.processSteps) {
      // ps.inputs und ps.outputs
      // ps.inputs.forEach((ts) => tsSet.set(ts.id, ts));
      ps.outputs.forEach((ts) => tsSet.set(ts.id, ts));
    }

    // Map => Array
    return Array.from(tsSet.values());
  }


  return (
    <>
      <Title>Monitoring</Title>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {simulation?.frames[frame]?.state.locations.map((loc) => {
          const locationTS = getTransportSystemsForLocation(loc);

          return (
            <MonitoringCard
              key={loc.id}
              name={loc.name}
              processSteps={loc.processSteps}
              transportSystems={locationTS}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
}