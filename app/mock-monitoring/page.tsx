"use client";

import { Flex, Paper, SimpleGrid, Table, Text, Title, Switch, Divider } from "@mantine/core";
import { FC, ReactNode, useEffect } from "react";
import { Prisma, TransportSystem } from "@prisma/client";
import { groupInventory } from "../incoming-goods/helpers";
import { useSimulationMock } from "@/components/SimulationContextMock";
import { LocationFull } from "@/lib/simulation/simulationMock";
import { MonitoringCard } from "@/components/MonitoringCard";



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
              location={loc}
              transportSystems={locationTS}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
}