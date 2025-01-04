// Monitoring.tsx
"use client";

import { useState } from "react";
import { Title, SimpleGrid, Text, Paper, Badge, Group, Stack, Flex, Container } from "@mantine/core";
import { useSimulationLive } from "@/components/context/SimulationContextLive";
import { MonitoringCard } from "@/components/monitoring/MonitoringCard";
import { DetailedLocationCard } from "@/components/monitoring/DetailedLocationCard";
import { Order } from "@prisma/client";

export default function Monitoring() {
  const { simulation, frame, orders } = useSimulationLive();
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  if (!simulation) {
    return <Text>Loading...</Text>;
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

  // Detaillierte Ansicht einer Location
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

  return (
    <>
      <Title order={2} mb="md">Monitoring</Title>

      {/* SimpleGrid für ALLE Orders der Simulation */}
      {/* <Title order={4} mb="sm">Orders</Title> */}
      <SimpleGrid cols={10} spacing="xs" mb="xl">
        {orders.map((order: Order) => (
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

      {/* Bisherige Locations */}
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {currentFrame.state.locations.map((loc) => (
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
