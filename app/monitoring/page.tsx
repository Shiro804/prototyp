"use client";

import { useState } from "react";
import { Title, SimpleGrid, Text } from "@mantine/core";
import { useSimulationLive } from "@/components/SimulationContextLive";
import { MonitoringCard } from "@/components/MonitoringCard";
import { DetailedLocationCard } from "@/components/DetailedLocationCard";

export default function Monitoring() {
  const { simulation, frame } = useSimulationLive();
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  if (!simulation) {
    return <Text>Loading...</Text>;
  }

  const currentFrame = simulation.frames[frame];

  // If a location is selected, show the Detailed View
  if (selectedLocationId !== null) {
    const location = currentFrame.locations.find((l) => l.id === selectedLocationId);
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
        {currentFrame.locations.map((loc) => (
          <MonitoringCard
            key={loc.id}
            location={loc}
            onDetailsClick={() => setSelectedLocationId(loc.id)}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
