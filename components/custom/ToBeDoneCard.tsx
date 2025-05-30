import { Card, Group, Badge, Button, Text, Image } from "@mantine/core";
import { FunctionComponent } from "react";
import { useSimulationMock } from "../context/SimulationContextMock";

interface ToBeDoneCardProps { }

const ToBeDoneCard: FunctionComponent<ToBeDoneCardProps> = () => {
  const { frame } = useSimulationMock();

  return (
    <Card shadow="xs" padding="md" radius="lg" withBorder>
      <Card.Section>
        <Image src="/construction.jpg" height={200} alt="Construction" />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={600}>Under Construction!</Text>
      </Group>

      <Text fw={400} size="sm" c="dimmed">
        This component is under construction. Please be patient!
      </Text>

      <Text fw={400} size="sm" c="dimmed">
        Frame: {frame}
      </Text>
    </Card>
  );
};

export default ToBeDoneCard;
