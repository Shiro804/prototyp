"use client";

import { useEffect } from "react";
import { Button, SimpleGrid, Title } from "@mantine/core";

import { useSimulation } from "@/components/SimulationContext";

export default function IncomingGoods() {
  const { toggle, load, simulation, frame } = useSimulation();

  useEffect(() => {
    console.log(simulation);
  }, [simulation]);

  return (
    <>
      <Title>Incoming Goods</Title>
      {simulation && <SimpleGrid cols={{ base: 2, md: 3 }}>{frame}</SimpleGrid>}
    </>
  );
}
