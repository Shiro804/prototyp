"use client";

import { useState } from "react";
import { Title, SimpleGrid, Text } from "@mantine/core";
import { useSimulationMock } from "@/components/SimulationContextMock";
import { MonitoringCard } from "@/components/monitoring/MonitoringCard";
import { DetailedLocationCard } from "@/components/monitoring/DetailedLocationCard";
import { LocationFull } from "@/lib/simulation/simulationMock";
import { TransportSystem } from "@prisma/client";

export default function Monitoring() {
  const { simulation, frame } = useSimulationMock();
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  if (!simulation) {
    return <Text>Please press on the calculate button.</Text>;
  }

  const currentFrame = simulation.frames[frame];

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

  // If a location is selected, show the Detailed View
  if (selectedLocationId !== null) {
    const location = currentFrame.state.locations.find((l) => l.id === selectedLocationId);
    if (!location) return <Text>Error: Location not found</Text>;

    return (
      <DetailedLocationCard
        location={location}
        onBack={() => setSelectedLocationId(null)}
      />
    );
  }


  // Otherwise, show the Overview
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
              onDetailsClick={() => setSelectedLocationId(loc.id)}
            />
          );
        })}
      </SimpleGrid>
    </>
  );
}
