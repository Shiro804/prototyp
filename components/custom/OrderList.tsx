"use client";

import React from "react";
import {
    SimpleGrid,
    Paper,
    Badge,
    Flex,
    Text,
    Stack,
    Button,
    Tooltip,
} from "@mantine/core";
import { IconInfoCircleFilled } from "@tabler/icons-react";
import { Order } from "@prisma/client";
import { BG_COLOR, COMPLETED, PENDING, PRIMARY, SECONDARY } from "@/lib/theme";

interface OrdersListProps {
    /** The orders array to display */
    orders: Order[];
    /** The current layout mode: "compact", "medium", or "big" */
    layout: "compact" | "medium" | "big";
    /** A function that returns a color string for a given order status */
    /** If true, display a tooltip with extended order info (the "detailed" style) */
    detailed?: boolean;
}

/**
 * A reusable OrdersList component for displaying Orders in different styles:
 * - If `detailed` is false (default), uses the "Monitoring" style (dark background, stack).
 * - If `detailed` is true, uses the "KPI" style (colored background, tooltips).
 */
export function OrdersList({
    orders,
    layout,
    detailed = false,
}: OrdersListProps) {

    const getStatusColor = (status: string): string => {
        switch (status) {
            case "completed":
                return COMPLETED;
            case "pending":
                return PENDING;
            case "in_progress":
                return PRIMARY;
            default:
                return "#95A5A6";
        }
    };

    return (
        <SimpleGrid
            cols={
                layout === "compact"
                    ? 10
                    : layout === "medium"
                        ? 8
                        : 5
            }
            spacing="xs"
            mb="xl"
        >
            {orders.map((order) => {
                return (
                    <Paper
                        key={order.id}
                        shadow="md"
                        p="xs"
                        pt="xs"
                        withBorder
                        style={{
                            // In "detailed" mode, no border highlight. Otherwise, show colored border.
                            color: "white",
                            borderWidth: "3px",
                            borderColor: getStatusColor(order.status)
                        }}
                        bg={BG_COLOR}
                    >
                        {/* If NOT detailed => original "Monitoring" style */}
                        {!detailed && (
                            <>
                                <Flex justify="center" align="center">
                                    <Badge
                                        color={getStatusColor(order.status)}
                                        variant="light"
                                        fz={8}
                                        style={{ borderColor: getStatusColor(order.status) }}
                                        mb="xs"
                                    >
                                        {order.status}
                                    </Badge>
                                </Flex>
                                <Stack gap={4}>
                                    <Flex w="100%" justify="space-between">
                                        <Text fw={700} size="xs">
                                            Order-ID:
                                        </Text>
                                        <Text fw={700} size="xs">
                                            {order.id}
                                        </Text>
                                    </Flex>
                                    <Flex w="100%" justify="space-between">
                                        <Text fw={700} size="xs">
                                            Quantity:
                                        </Text>
                                        <Text fw={700} size="xs">
                                            {order.quantity}
                                        </Text>
                                    </Flex>
                                    {order.completedAt && (
                                        <Flex w="100%" justify="space-between">
                                            <Text fw={700} size="xs">
                                                Completed:
                                            </Text>
                                            <Text fw={700} size="xs">
                                                {layout === "big"
                                                    ? new Date(order.completedAt).toLocaleString()
                                                    : new Date(order.completedAt).toLocaleTimeString()}
                                            </Text>
                                        </Flex>
                                    )}
                                </Stack>
                            </>
                        )}

                        {/* If detailed => original "KPI" style with tooltip */}
                        {detailed && (
                            <Flex direction="column-reverse" align="center" justify="center">
                                <Badge color={getStatusColor(order.status)} variant="light" fz={8} style={{ borderColor: getStatusColor(order.status) }} mb="xs">
                                    {order.status}
                                </Badge>
                                <Flex justify="center" align="center" p={0} m={0}>
                                    <Flex w={30}></Flex>
                                    <Text
                                        ta="center"
                                        fw={500}
                                        size="xs"
                                        mr="auto"
                                        w="100%"
                                    >
                                        Order-ID: {order.id}
                                    </Text>
                                    <Flex w={30} p={0} m={0} align="center" justify="center">
                                        <Tooltip
                                            label={
                                                <Flex direction="column" gap={10}>
                                                    {Object.entries(order).map(([key, value]) => (
                                                        <Text key={key} size="xs">
                                                            {key}: {value ? value.toString() : "-"}
                                                        </Text>
                                                    ))}
                                                </Flex>
                                            }
                                            multiline
                                            maw={600}
                                        >
                                            <Button
                                                m={0}
                                                p={0}
                                                size="xs"
                                                variant="transparent"
                                                color="white"
                                            >
                                                <IconInfoCircleFilled />
                                            </Button>
                                        </Tooltip>
                                    </Flex>
                                </Flex>
                            </Flex>
                        )}
                    </Paper>
                );
            })}
        </SimpleGrid>
    );
}
