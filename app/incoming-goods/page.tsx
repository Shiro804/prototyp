"use client";

import { Button, Divider, Paper, SimpleGrid, Table, Text, Title } from "@mantine/core";
import { FC, ReactNode, useState } from "react";
import { getIncomingCommodities, getTotalCommodities, groupInventory } from "../../components/helpers";
import { InventoryEntry, ProcessStep } from "@prisma/client";
import { useSimulationLive } from "@/components/context/SimulationContextLive";
import { LocationTreeView } from "@/components/custom/LocationTreeView";

interface LocationCardProps {
  name: ReactNode;
  incoming: InventoryEntry[][];
  total: ReactNode;
  onDetailsClick: () => void;
}

const LocationCard: FC<LocationCardProps> = ({ name, incoming, total, onDetailsClick }) => (
  <Paper shadow="sm" p="lg">
    <Text fw="bold" size="lg" mb="md">
      {name}
    </Text>
    <Text fw="600">Incoming Commodities</Text>
    <Text mb="sm">{incoming.flatMap((i) => i).length}</Text>
    <Divider color="grey" mt="10px" mb="10px" style={{ borderRadius: "10px" }} />
    <Text fw="600">Current Commodities</Text>
    <Text>{total}</Text>
    <Divider color="grey" mt="10px" mb="10px" style={{ borderRadius: "10px" }} />
    <Button onClick={onDetailsClick} variant="outline" size="sm">
      View Details
    </Button>
  </Paper>
);

export default function IncomingGoods() {
  const { simulation, frame } = useSimulationLive();
  const [selectedLocation, setSelectedLocation] = useState<number | null>(null);

  if (!simulation) {
    return <Text>Loading...</Text>;
  }

  const currentFrame = simulation.frames[frame];

  // If a location is selected, show its detailed view
  if (selectedLocation !== null) {
    const location = currentFrame.locations.find((l) => l.id === selectedLocation);
    if (!location) return <Text>Error: Location not found</Text>;

    const groupedInventory = groupInventory(
      location.processSteps.flatMap((ps) => ps.inventory)
    );


    return (
      <Paper shadow="md" p="lg">
        <Title>{location.name} - Detailed View</Title>
        <Button mt="md" onClick={() => setSelectedLocation(null)}>
          Back to Overview
        </Button>
        <Divider my="lg" />
        <Table striped highlightOnHover>
          <thead>
            <tr>
              <th>Material</th>
              <th>Quantity</th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(groupedInventory)
              .sort(([materialA], [materialB]) => materialA.localeCompare(materialB))
              .map(([material, quantity]) => (
                <tr key={material}>
                  <td>{material}</td>
                  <td>{quantity}</td>
                </tr>
              ))}
          </tbody>
        </Table>
        <LocationTreeView location={location} />
      </Paper>
    );
  }

  // Default view shows the overview
  return (
    <>
      <Title>Incoming Commodities</Title>
      <SimpleGrid cols={{ base: 1, md: 2 }}>
        {currentFrame.locations.map((l) => (
          <LocationCard
            key={l.id}
            name={l.name}
            incoming={getIncomingCommodities(l)}
            total={getTotalCommodities(l)}
            onDetailsClick={() => setSelectedLocation(l.id)}
          />
        ))}
      </SimpleGrid>
    </>
  );
}
