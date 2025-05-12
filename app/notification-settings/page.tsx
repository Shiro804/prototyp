"use client";

import { useState } from "react";
import { useSimulationLive } from "@/components/context/SimulationContextLive";
import { LocationFull } from "@/lib/simulation/Simulation";
import { Flex, SimpleGrid, Switch, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";

// State to manage disabled notifications
const disabledNotifications: Record<string, boolean> = {};

// Exported function to handle notifications
export function handleNotification(
    notificationIdName: string,
    title: string,
    message: string
) {
    if (!disabledNotifications[notificationIdName]) {
        notifications.show({
            id: notificationIdName,
            title,
            message,
        });
    }
}

function NotificationSettings() {
    const { simulation, frame } = useSimulationLive();
    const [areAllNotificationsDisabled, setAreAllNotificationsDisabled] = useState(false);

    // Global toggle that updates all notifications (orders and process steps)
    const toggleAllNotifications = () => {
        const newDisabledState = !areAllNotificationsDisabled;
        setAreAllNotificationsDisabled(newDisabledState);

        // Update orders notifications
        const ordersKeys = [
            "Order Status",
            "Order Reservation",
            "Order Completed",
            "Order Reservation Failed",
            "Live Simulation",
            "Simulation Stopped",
            "Queue"
        ];
        ordersKeys.forEach((key) => {
            disabledNotifications[key] = newDisabledState;
            if (newDisabledState) {
                notifications.hide(key);
            } else {
                notifications.show({
                    id: key,
                    title: "Notification Enabled",
                    message: `Notifications for ${key} have been enabled.`,
                    color: "green",
                });
            }
        });

        // Update process steps notifications in locations
        if (simulation?.frames[frame].state.locations) {
            simulation.frames[frame].state.locations.forEach((loc) => {
                loc.processSteps.forEach((ps) => {
                    disabledNotifications[ps.name] = newDisabledState;
                    if (newDisabledState) {
                        notifications.hide(ps.name);
                    } else {
                        notifications.show({
                            id: ps.name,
                            title: "Notification Enabled",
                            message: `Notifications for process step "${ps.name}" have been enabled.`,
                            color: "green",
                        });
                    }
                });
            });
        }

        notifications.show({
            title: newDisabledState ? "All Notifications Disabled" : "All Notifications Enabled",
            message: `All notifications have been ${newDisabledState ? "disabled" : "enabled"}.`,
            color: newDisabledState ? "red" : "green",
        });
    };

    // Toggle notification visibility for a specific process step
    const toggleNotificationForProcessStep = (processStepName: string) => {
        // Prevent individual toggles when global notifications are disabled
        if (areAllNotificationsDisabled) return;

        disabledNotifications[processStepName] = !disabledNotifications[processStepName];

        if (disabledNotifications[processStepName]) {
            notifications.hide(processStepName);
            notifications.show({
                title: "Notification Disabled",
                message: `Notifications for process step "${processStepName}" have been disabled.`,
                color: "red",
            });
        } else {
            notifications.show({
                id: processStepName,
                title: "Notification Enabled",
                message: `Notifications for process step "${processStepName}" have been enabled.`,
                color: "green",
            });
        }
    };

    function returnLocationsWithProcessStepsWithRecipes(locations: LocationFull[]): LocationFull[] {
        return locations.filter((loc) =>
            loc.processSteps.some((ps) => ps.recipe)
        );
    }

    return (
        <SimpleGrid cols={1}>
            {/* Notification Settings Header */}
            <Flex align={"center"} h={"fit-content"} gap={10}> 
                <Text fw={700} fz={25}>
                    Notification Settings
                </Text>
                <Switch
                    checked={!areAllNotificationsDisabled}
                    onChange={toggleAllNotifications}
                    label={areAllNotificationsDisabled ? "Disabled" : "Enabled"}
                />
            </Flex>
            <Text fw={600} fz={15} mb={10} maw={800}>
                Here you can (De-)Activate Notifications for every process step within
                the Live Simulation. Only process steps, which produce (sub)products, thus producing messages, are being shown.
            </Text>
            <Flex direction="column">
                <Flex
                    w="100%"
                    direction="column"
                    justify="center"
                    align="flex-start"
                    maw={500}
                    gap={20}
                >
                    {/* Locations header with global switch */}
                    <Flex direction="row" align="center" justify="space-between" w="100%">
                        <Text fz={20} fw={700}>
                            Locations
                        </Text>
                    </Flex>
                    {simulation?.frames[frame].state.locations &&
                        returnLocationsWithProcessStepsWithRecipes(simulation.frames[frame].state.locations).map((loc) => (
                            <Flex key={loc.id} direction="column" w="100%">
                                {/* Location Name */}
                                <Text fw={600} fz={16} mb={10}>
                                    {loc.name}
                                </Text>
                                {/* Process Steps */}
                                <Flex direction="column" w="100%" gap={10} pl={20}>
                                    {loc.processSteps.map((ps) => (
                                        <Flex
                                            key={ps.id}
                                            direction="row"
                                            align="center"
                                            justify="space-between"
                                        >
                                            <Text fw={500} fz={16}>
                                                {ps.name}
                                            </Text>
                                            <Switch
                                                checked={!disabledNotifications[ps.name]}
                                                onChange={() => toggleNotificationForProcessStep(ps.name)}
                                                disabled={areAllNotificationsDisabled}
                                            />
                                        </Flex>
                                    ))}
                                </Flex>
                            </Flex>
                        ))}
                    <Text fz={20} fw={700}>
                        Orders
                    </Text>
                    <Flex key={"orders"} direction="column" pl={20} w="100%" gap={10}>
                        {[
                            "Order Status",
                            "Order Reservation",
                            "Order Completed",
                            "Order Reservation Failed",
                            "Live Simulation",
                            "Simulation Stopped",
                            "Queue"
                        ].map((key) => (
                            <Flex key={key} direction="row" align="center" justify="space-between">
                                <Text>{key}</Text>
                                <Switch
                                    checked={!disabledNotifications[key]}
                                    onChange={() => toggleNotificationForProcessStep(key)}
                                    disabled={areAllNotificationsDisabled}
                                />
                            </Flex>
                        ))}
                    </Flex>
                </Flex>
            </Flex>
        </SimpleGrid>
    );
}

export default NotificationSettings;
