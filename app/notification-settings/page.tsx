"use client";

import { useSimulationLive } from "@/components/context/SimulationContextLive";
import { LocationFull } from "@/lib/simulation/simulationNew";
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

    // Toggle notification visibility for a specific process step
    const toggleNotificationForProcessStep = (processStepName: string) => {
        disabledNotifications[processStepName] = !disabledNotifications[processStepName];

        if (disabledNotifications[processStepName]) {
            notifications.hide(processStepName);
            notifications.show({
                title: "Notification Disabled",
                message: `Notifications for process step \"${processStepName}\" have been disabled.`,
                color: "red",
            });
        } else {
            notifications.show({
                id: processStepName,
                title: "Notification Enabled",
                message: `Notifications for process step \"${processStepName}\" have been enabled.`,
                color: "green",
            });
        }
    };

    function returnLocationsWithProcessStepsWithRecipes(locations: LocationFull[]): LocationFull[] {
        return locations.filter((loc) =>
            loc.processSteps.some((ps) => ps.recipe) // Prüfe, ob mindestens ein `processStep` ein Rezept hat
        );
    }
    return (
        <SimpleGrid cols={1}>
            {/* Notification Settings */}
            <Text fw={700} fz={25} mb={-10}>
                Notification Settings
            </Text>
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
                    <Text fz={20} fw={700}>Locations</Text>
                    {simulation?.frames[frame].locations && returnLocationsWithProcessStepsWithRecipes(simulation?.frames[frame].locations).map((loc) => (
                        <Flex key={loc.id} direction="column" w="100%">
                            {/* Location Name */}
                            <Text fw={600} fz={16} mb={10}>
                                {loc.name}
                            </Text>
                            {/* Process Steps */}
                            <Flex
                                direction="column"
                                w="100%"
                                gap={10}
                                pl={20} // Indent process steps for better UI
                            >
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
                                        />
                                    </Flex>
                                ))}
                            </Flex>
                        </Flex>
                    ))}
                    <Text fz={20} fw={700}>Orders</Text>
                    <Flex key={"cock"} direction="column" pl={20} w="100%" gap={10}>
                        <Flex direction="row" align="center" justify="space-between">
                            <Text>Order Status</Text>
                            <Switch
                                checked={!disabledNotifications["Order Status"]}
                                onChange={() => toggleNotificationForProcessStep("Order Status")}
                            />
                        </Flex>
                        <Flex direction="row" align="center" justify="space-between">
                            <Text>Order Reservation</Text>
                            <Switch
                                checked={!disabledNotifications["Order Reservation"]}
                                onChange={() => toggleNotificationForProcessStep("Order Reservation")}
                            />
                        </Flex>
                        <Flex direction="row" align="center" justify="space-between">
                            <Text>Order Completed</Text>
                            <Switch
                                checked={!disabledNotifications["Order Completed"]}
                                onChange={() => toggleNotificationForProcessStep("Order Completed")}
                            />
                        </Flex>
                        <Flex direction="row" align="center" justify="space-between">
                            <Text>Order Reservation Failed</Text>
                            <Switch
                                checked={!disabledNotifications["Order Reservation Failed"]}
                                onChange={() => toggleNotificationForProcessStep("Order Reservation Failed")}
                            />
                        </Flex>
                        <Flex direction="row" align="center" justify="space-between">
                            <Text>Live Simulation</Text>
                            <Switch
                                checked={!disabledNotifications["Live Simulation"]}
                                onChange={() => toggleNotificationForProcessStep("Live Simulation")}
                            />
                        </Flex>
                        <Flex direction="row" align="center" justify="space-between">
                            <Text>Simulation Stopped</Text>
                            <Switch
                                checked={!disabledNotifications["Simulation Stopped"]}
                                onChange={() => toggleNotificationForProcessStep("Simulation Stopped")}
                            />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
        </SimpleGrid>
    );
}

export default NotificationSettings;
