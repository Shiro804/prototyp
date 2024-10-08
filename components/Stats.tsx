import { Group, Paper, Skeleton, Text } from "@mantine/core";
import { ReactNode } from "react";

export interface StatCardProps<T extends ReactNode> {
  title: string;
  skeletonOnUndefinedValue?: boolean;
  value?: T;
  icon?: ReactNode;
}

export function StatCard<T extends ReactNode>({
  title,
  skeletonOnUndefinedValue = true,
  icon,
  value,
}: Readonly<StatCardProps<T>>) {
  return (
    <Paper withBorder p="md" radius="md" key={title}>
      <Group justify="space-between">
        <Text c="dimmed">{title}</Text>
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
