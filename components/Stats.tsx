import { Group, Paper, Skeleton, Text } from "@mantine/core";
import { ReactNode } from "react";

export interface StatCardProps {
  title: string;
  skeletonOnUndefinedValue?: boolean;
  value?: any;
  icon?: ReactNode;
}

export function StatCard({
  title,
  skeletonOnUndefinedValue = true,
  icon,
  value,
}: Readonly<StatCardProps>) {
  return (
    <Paper withBorder p="md" radius="md" key={title}>
      <Group justify="space-between">
        <Text c="dimmed">
          {title}
        </Text>
        {icon}
      </Group>
      {skeletonOnUndefinedValue && value === undefined ? (
        <Skeleton />
      ) : (
        <Text>{value}</Text>
      )}
    </Paper>
  );
}
