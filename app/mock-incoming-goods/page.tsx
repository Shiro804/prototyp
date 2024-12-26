"use client";

import { Divider, Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { FC, ReactNode, useEffect } from "react";

import { useSimulationMock, useSimulationLive } from "@/components/SimulationContext";
import { getIncomingCommodities, getTotalCommodities, groupInventory } from "./helpers";
import { InventoryEntry } from "@prisma/client";

interface LocationCardProps {
  name: ReactNode;
  incoming: InventoryEntry[][];
  total: ReactNode;
}

const LocationCard: FC<LocationCardProps> = ({ name, incoming, total }) => (
  <Paper shadow="sm" p="lg">
    <Text fw="bold" size="lg" mb="md">
      {name}
    </Text>
    <Text fw="600">Incoming Commodities</Text>
    <Text mb="sm">{incoming.flatMap(i => i).length}</Text>
    <Divider color="grey" mt="10px" mb="10px" style={{ borderRadius: "10px" }} />
    {
      incoming.flatMap(i => {
        if (i.length === 0 || i[0] === undefined) {
          return null; // Skip this iteration if the array is empty or the first element is undefined
        }
        return (
          <>
            <Text fw="600">{i[0].material}</Text>
            <Text fw={500} mb="sm">{i.length}</Text>
          </>
        );
      })
    }
    <Divider color="grey" mt="10px" mb="10px" style={{ borderRadius: "10px" }} />
    <Text fw="600">Current Commodities</Text>
    <Text>{total}</Text>
  </Paper>
);

export default function IncomingGoods() {
  const { simulation, frame } = useSimulationMock();

  useEffect(() => {
    console.log(simulation);
  }, [simulation]);

  return (
    <>
      <Title>Incoming Commodities</Title>
      <SimpleGrid cols={{ base: 2, md: 3 }}>
        {simulation?.frames[frame].locations.map((l) => (
          <LocationCard
            key={l.id}
            name={l.name}
            incoming={getIncomingCommodities(l)}
            total={getTotalCommodities(l)}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
