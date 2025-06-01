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

/**
 * Reusable statistical display card component with loading state support
 * Supports any ReactNode as value content (text, numbers, charts, etc.)
 */
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
      {/* Conditional skeleton loading: shows loading state when value is undefined, unless explicitly disabled */}
      {skeletonOnUndefinedValue && value === undefined ? (
        <Skeleton />
      ) : (
        <Text fw={600} c="#757575">{value}</Text>
      )}
    </Paper>
  );
}