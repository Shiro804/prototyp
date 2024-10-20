"use client";

import { Paper, SimpleGrid, Text, Title } from "@mantine/core";
import { FC, ReactNode, useEffect } from "react";

import { useSimulation } from "@/components/SimulationContext";
import { getIncomingCommodities, getTotalCommodities } from "./helpers";

interface LocationCardProps {
  name: ReactNode;
  incoming: ReactNode;
  total: ReactNode;
}

const LocationCard: FC<LocationCardProps> = ({ name, incoming, total }) => (
  <Paper shadow="sm" p="lg">
    <Text fw="bold" size="lg" mb="md">
      {name}
    </Text>
    <Text fw="bold">Incoming Commodities</Text>
    <Text mb="sm">{incoming}</Text>
    <Text fw="bold">Current Commodities</Text>
    <Text>{total}</Text>
  </Paper>
);

export default function IncomingGoods() {
  const { simulation, frame } = useSimulation();

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
