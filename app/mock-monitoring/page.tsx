"use client";

import { useState } from "react";
import { Title, SimpleGrid, Text, Paper, Flex, Badge, Stack } from "@mantine/core";
import { useSimulationMock } from "@/components/context/SimulationContextMock";
import { MonitoringCard } from "@/components/monitoring/MonitoringCard";
import { DetailedLocationCard } from "@/components/monitoring/DetailedLocationCard";
import { LocationFull } from "@/lib/simulation/Simulation";
import { Order, TransportSystem } from "@prisma/client";

export default function Monitoring() {
  const { simulation, frame } = useSimulationMock();
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  if (!simulation) {
    return <Text>Please press on the calculate button.</Text>;
  }

  const currentFrame = simulation.frames[frame];

  /**
 * Funktion zur Bestimmung der Hintergrundfarbe basierend auf dem Order-Status.
 */
  const getStatusColor = (status: string): string => {
    switch (status) {
      case "completed":
        return "#2ECC40";
      case "pending":
        return "#9B59B6";
      case "in_progress":
        return "#4263eb";
      default:
        return "#95A5A6";
    }
  };

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
      {/* SimpleGrid für ALLE Orders der Simulation */}
      {/* <Title order={4} mb="sm">Orders</Title> */}
      <SimpleGrid cols={10} spacing="xs" mb="xl">
        {simulation.frames[frame].orders.map((order: Order) => (
          <Paper
            key={order.id}
            shadow="md"
            p="md"
            pt="xs"
            withBorder
            style={{
              backgroundColor: getStatusColor(order.status),
              color: "white",
            }}
          >
            <Flex direction="column-reverse">
              <Text fw={500} size="xs">Order-ID: {order.id}</Text>
              <Flex justify="center" align="center">
                <Badge color="white" variant="light" fz={8} mb="xs">
                  {order.status}
                </Badge>
              </Flex>
            </Flex>

            <Stack gap={5}>
              <Text size="xs">Quantity: {order.quantity}</Text>
              {order.completedAt && (
                <Text size="xs">
                  Completed At: {new Date(order.completedAt).toLocaleString()}
                </Text>
              )}
            </Stack>
          </Paper>
        ))}
      </SimpleGrid>
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
