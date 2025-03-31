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
import { BG_COLOR, COMPLETED, PENDING, PRIMARY } from "@/lib/theme";

// Import our mappings and helpers
import {
    getFriendlyStatusLabel,
    getFriendlyLabel,
    getFriendlyValue,
} from "./utils/friendlyMappings";

// 1) Import the skip array
import { PROPERTIES_TO_SKIP } from "./utils/technicalKeywords";

interface OrdersListProps {
    /** The orders array to display */
    orders: Order[];
    /** The current layout mode: "compact", "medium", or "big" */
    layout: "compact" | "medium" | "big";
    /** If true, display a tooltip with extended order info (the "detailed" style) */
    detailed?: boolean;
}

/**
 * A reusable OrdersList component for displaying Orders in different styles.
 */
export function OrdersList({
    orders,
    layout,
    detailed = false,
}: OrdersListProps) {
    // A helper to convert the raw status into a color
    const getStatusColor = (status: string): string => {
        const friendlyStatus = getFriendlyStatusLabel(status);
        switch (friendlyStatus) {
            case "Completed":
                return COMPLETED; // e.g. "#2ECC40"
            case "Pending":
                return PENDING; // e.g. "#9B59B6"
            case "In Progress":
                return PRIMARY; // e.g. "#5300E8"
            default:
                return "#95A5A6";
        }
    };

    // A helper to detect if a value is a valid date string
    const isDateString = (val: any) => {
        // Attempt to parse; if it gives a valid date, we'll format it
        if (typeof val === "string") {
            const parsed = Date.parse(val);
            return !isNaN(parsed);
        }
        return false;
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
                            color: "white",
                            borderWidth: "3px",
                            borderColor: getStatusColor(order.status),
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
                                        {getFriendlyStatusLabel(order.status)}
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

                        {/* If detailed => "KPI" style with tooltip */}
                        {detailed && (
                            <Flex direction="column-reverse" align="center" justify="center">
                                <Badge
                                    color={getStatusColor(order.status)}
                                    variant="light"
                                    fz={8}
                                    style={{ borderColor: getStatusColor(order.status) }}
                                    mb="xs"
                                >
                                    {getFriendlyStatusLabel(order.status)}
                                </Badge>
                                <Flex justify="center" align="center" p={0} m={0}>
                                    <Flex w={30} />
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
                                                    {/* 2) Filter out null values and all properties in PROPERTIES_TO_SKIP */}
                                                    {Object.entries(order)
                                                        .filter(([key, value]) => {
                                                            // skip if in the array
                                                            if (PROPERTIES_TO_SKIP.includes(key)) {
                                                                return false;
                                                            }
                                                            // skip if null
                                                            if (value === null) {
                                                                return false;
                                                            }
                                                            return true;
                                                        })
                                                        .map(([key, value]) => {
                                                            // If it's a valid date string, format it
                                                            let displayValue: string = getFriendlyValue(key, value);

                                                            return (
                                                                <Text key={key} size="xs">
                                                                    {getFriendlyLabel(key)}: {displayValue}
                                                                </Text>
                                                            );
                                                        })}
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
