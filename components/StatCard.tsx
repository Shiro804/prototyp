import { Group, Paper, Skeleton, Text } from "@mantine/core";
import { ReactNode } from "react";

/**
 * Props interface for the StatCard component
 * @template T - Type extending ReactNode for the value prop
 */
export interface StatCardProps<T extends ReactNode> {
  /** The title to display at the top of the card */
  title: string;
  /** Whether to show a skeleton loader when value is undefined */
  skeletonOnUndefinedValue?: boolean;
  /** The main value to display in the card */
  value?: T;
  /** Optional icon to display next to the title */
  icon?: ReactNode;
  /** Optional height of the card */
  height?: string;
  /** Optional width of the card */
  width?: string;
}

/**
 * A card component that displays a statistic with a title and optional icon
 * @template T - Type extending ReactNode for the value prop
 * @param props - The component props
 * @returns A styled card containing the stat information
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
    // Main card container with gray background
    <Paper bg="#D9D9D9" withBorder h={height ? height : "200px"} w={width ? width : "100%"} p="md" radius="md" key={title}>
      {/* Header group with title and optional icon */}
      <Group justify="space-between">
        <Text fw={600} c="black">{title}</Text>
        {icon}
      </Group>
      {/* Content area - shows skeleton if value is undefined and skeletonOnUndefinedValue is true */}
      {skeletonOnUndefinedValue && value === undefined ? (
        <Skeleton />
      ) : (
        <Text fw={600} c="#757575">{value}</Text>
      )}
    </Paper>
  );
}
