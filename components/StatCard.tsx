import { Group, Paper, Skeleton, Text } from "@mantine/core";
import { ReactNode } from "react";

export interface StatCardProps<T extends ReactNode> {
  title: string;
  skeletonOnUndefinedValue?: boolean;
  value?: T;
  icon?: ReactNode;
  height?: string;
  width?: string;
}

export function StatCard<T extends ReactNode>({
  title,
  skeletonOnUndefinedValue = true,
  icon,
  value,
  height,
  width
}: Readonly<StatCardProps<T>>) {
  return (
    <Paper bg="#D9D9D9" withBorder h={height ? height : "200px"} w={width ? width : "100%"} p="md" radius="md" key={title}>
      <Group justify="space-between">
        <Text fw={600} c="black">{title}</Text>
        {icon}
      </Group>
      {skeletonOnUndefinedValue && value === undefined ? (
        <Skeleton />
      ) : (
        <Text fw={600} c="#757575">{value}</Text>
      )}
    </Paper>
  );
}
