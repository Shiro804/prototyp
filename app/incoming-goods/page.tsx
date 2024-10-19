"use client";

import { Button, SimpleGrid, Title } from "@mantine/core";

import { useSimulation, useSimulationPlayer } from "@/lib/simulation/hook";
import { useEffect } from "react";

export default function IncomingGoods() {
  const { load, result } = useSimulation();
  const { toggle, frame } = useSimulationPlayer(1);

  const loadSimulation = () => {
    load(1000);
  };

  const startSimulation = () => {
    toggle();
  };

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <>
      <Title>Incoming Goods</Title>
      {result && <SimpleGrid cols={{ base: 2, md: 3 }}>{frame}</SimpleGrid>}
      <Button onClick={loadSimulation}>Load</Button>
      {result && <Button onClick={startSimulation}>Start</Button>}
    </>
  );
}
