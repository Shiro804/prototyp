// MonitoringCard.tsx
import { FC, useState } from "react";
import {
    Paper,
    Table,
    Flex,
    Text,
    Button,
    Switch,
} from "@mantine/core";
import { LocationFull } from "@/lib/simulation/Simulation";
import { groupInventory } from "@/components/helpers";
import { useSimulationMock } from "../context/SimulationContextMock";
import { BG_COLOR, PRIMARY, SECONDARY } from "@/lib/theme";
import { IconAdjustmentsAlt } from "@tabler/icons-react";

// Import your new popover
import { EntityAdjustmentPopover } from "./EntityAdjustmentPopover";

interface MonitoringCardProps {
    location: LocationFull;
    onDetailsClick?: () => void;
}

export const MonitoringCard: FC<MonitoringCardProps> = ({
    location,
    onDetailsClick,
}) => {
    const { name, processSteps } = location;
    const { toggleProcessStep, toggleTransportSystem, toggleResource, playing } =
        useSimulationMock();

    // We track popover states:
    const [openedPopoverId, setOpenedPopoverId] = useState<string | null>(null);
    // The idea is: for each entity, we pass an ID like "processStep-123" or "ts-45" or "resource-99"
    // so only one popover is open at a time. If you want multiple open, do a different approach.

    const handlePopoverToggle = (entityId: string) => {
        if (openedPopoverId === entityId) {
            // close it
            setOpenedPopoverId(null);
        } else {
            // open it
            setOpenedPopoverId(entityId);
        }
    };

    return (
        <Paper
            shadow="md"
            p="lg"
            style={{ overflowY: "auto", width: "100%", height: "550px" }}
            bg="#18181B"
            c={"white"}
            radius={10}
        >
            <Flex direction="column" h="100%">
                <Flex align="center" justify="center" direction="row" w="100%" pb={20}>
                    <Text miw="120px"></Text>
                    <Flex w="100%" direction="row" justify="center" align="center">
                        <Text fw="bold" size="lg">
                            {name}
                        </Text>
                    </Flex>

                    {onDetailsClick && (
                        <Button
                            miw="120px"
                            ml="auto"
                            onClick={onDetailsClick}
                            color={PRIMARY}
                            variant="outline"
                        >
                            View Details
                        </Button>
                    )}
                </Flex>

                {/* SUMMARY: For each ProcessStep, show inventory & transportSystems & resources */}
                {processSteps
                    .slice()
                    .reverse()
                    .map((ps) => {
                        // Unique ID for processStep popover
                        const processStepPopoverId = `processStep-${ps.id}`;

                        return (
                            <Flex
                                w="100%"
                                direction="column"
                                key={ps.id}
                                bg={BG_COLOR}
                                p={10}
                                mb={20}
                                style={{ borderRadius: "10px" }}
                            >
                                <Flex align="center" justify="space-between">
                                    <Text my="md" color={PRIMARY} fw={600}>
                                        {ps.name}
                                    </Text>
                                    <Flex align={"center"} gap={5}>
                                        {/* The button that toggles the popover for this ProcessStep */}
                                        <Button
                                            variant="transparent"
                                            p={0}
                                            onClick={() => handlePopoverToggle(processStepPopoverId)}
                                        >
                                            <IconAdjustmentsAlt color={PRIMARY} />
                                        </Button>

                                        {/* The popover for adjusting ProcessStep fields */}
                                        <EntityAdjustmentPopover
                                            entity={ps}
                                            entityType="processStep"
                                            opened={openedPopoverId === processStepPopoverId}
                                            onOpenedChange={(val) =>
                                                setOpenedPopoverId(val ? processStepPopoverId : null)
                                            }
                                            playing={playing}
                                        />

                                        <Switch
                                            color={PRIMARY}
                                            checked={ps.active}
                                            onChange={() => toggleProcessStep(ps.id)}
                                        />
                                    </Flex>
                                </Flex>

                                {/* Table for the materials in this process step */}
                                <Table withRowBorders>
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Flex
                                                gap="md"
                                                justify="space-between"
                                                align="flex-start"
                                                direction="row"
                                                wrap="nowrap"
                                            >
                                                <Table.Th style={{ color: SECONDARY }} fw={700}>
                                                    Material
                                                </Table.Th>
                                                <Table.Th fw={700} style={{ color: SECONDARY }}>
                                                    Count
                                                </Table.Th>
                                            </Flex>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {Object.entries(groupInventory([ps.inventory])).map(
                                            ([material, count]) => (
                                                <Table.Tr key={material}>
                                                    <Flex
                                                        gap="md"
                                                        justify="space-between"
                                                        align="flex-start"
                                                        direction="row"
                                                        wrap="nowrap"
                                                    >
                                                        <Table.Td fw={600}>{material}</Table.Td>
                                                        <Table.Td fw={600}>{count}</Table.Td>
                                                    </Flex>
                                                </Table.Tr>
                                            )
                                        )}
                                    </Table.Tbody>
                                </Table>

                                {/* Table for output TransportSystems */}
                                {ps.outputs && ps.outputs.length > 0 && (
                                    <Flex direction="column" mt="md">
                                        <Table withRowBorders>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Flex
                                                        gap="md"
                                                        justify="space-between"
                                                        align="flex-start"
                                                        direction="row"
                                                        wrap="nowrap"
                                                    >
                                                        <Table.Th fw={700} style={{ color: SECONDARY }}>
                                                            Transport System
                                                        </Table.Th>
                                                        <Table.Th fw={700} style={{ color: SECONDARY }}>
                                                            Active
                                                        </Table.Th>
                                                    </Flex>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {ps.outputs.map((ts) => {
                                                    const tsPopoverId = `transportSystem-${ts.id}`;
                                                    return (
                                                        <Table.Tr key={ts.id}>
                                                            <Flex
                                                                gap="md"
                                                                justify="space-between"
                                                                align="flex-start"
                                                                direction="row"
                                                                wrap="nowrap"
                                                            >
                                                                <Table.Td fw={600}>{ts.name}</Table.Td>
                                                                <Table.Td fw={600}>
                                                                    <Flex align={"center"} gap={5}>
                                                                        <Button
                                                                            p={0}
                                                                            variant="transparent"
                                                                            onClick={() =>
                                                                                handlePopoverToggle(tsPopoverId)
                                                                            }
                                                                        >
                                                                            <IconAdjustmentsAlt color={PRIMARY} />
                                                                        </Button>

                                                                        {/* The popover for adjusting TransportSystem fields */}
                                                                        <EntityAdjustmentPopover
                                                                            entity={ts}
                                                                            entityType="transportSystem"
                                                                            opened={openedPopoverId === tsPopoverId}
                                                                            onOpenedChange={(val) =>
                                                                                setOpenedPopoverId(
                                                                                    val ? tsPopoverId : null
                                                                                )
                                                                            }
                                                                            playing={playing}
                                                                        />

                                                                        <Switch
                                                                            color={SECONDARY}
                                                                            checked={ts.active}
                                                                            onChange={() =>
                                                                                toggleTransportSystem(ts.id)
                                                                            }
                                                                        />
                                                                    </Flex>
                                                                </Table.Td>
                                                            </Flex>
                                                        </Table.Tr>
                                                    );
                                                })}
                                            </Table.Tbody>
                                        </Table>
                                    </Flex>
                                )}

                                {/* New Table for the resources of this process step */}
                                {ps.resources && ps.resources.length > 0 && (
                                    <Flex direction="column" mt="md">
                                        <Table withRowBorders>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Flex
                                                        gap="md"
                                                        justify="space-between"
                                                        align="flex-start"
                                                        direction="row"
                                                        wrap="nowrap"
                                                    >
                                                        <Table.Th style={{ color: SECONDARY }} fw={700}>
                                                            Resource
                                                        </Table.Th>
                                                        <Table.Th fw={700} style={{ color: SECONDARY }}>
                                                            Active
                                                        </Table.Th>
                                                    </Flex>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {ps.resources.map((r) => {
                                                    const resourcePopoverId = `resource-${r.id}`;
                                                    return (
                                                        <Table.Tr key={r.id}>
                                                            <Flex
                                                                gap="md"
                                                                justify="space-between"
                                                                align="flex-start"
                                                                direction="row"
                                                                wrap="nowrap"
                                                            >
                                                                <Table.Td fw={600}>{r.name}</Table.Td>
                                                                <Table.Td fw={600}>
                                                                    <Flex align={"center"} gap={5}>
                                                                        <Button
                                                                            variant="transparent"
                                                                            p={0}
                                                                            onClick={() =>
                                                                                handlePopoverToggle(resourcePopoverId)
                                                                            }
                                                                        >
                                                                            <IconAdjustmentsAlt color={PRIMARY} />
                                                                        </Button>

                                                                        {/* The popover for adjusting Resource fields */}
                                                                        <EntityAdjustmentPopover
                                                                            entity={r}
                                                                            entityType="resource"
                                                                            opened={
                                                                                openedPopoverId === resourcePopoverId
                                                                            }
                                                                            onOpenedChange={(val) =>
                                                                                setOpenedPopoverId(
                                                                                    val ? resourcePopoverId : null
                                                                                )
                                                                            }
                                                                            playing={playing}
                                                                        />

                                                                        <Switch
                                                                            color={SECONDARY}
                                                                            key={r.id}
                                                                            checked={r.active}
                                                                            onChange={() => toggleResource(r)}
                                                                        />
                                                                    </Flex>
                                                                </Table.Td>
                                                            </Flex>
                                                        </Table.Tr>
                                                    );
                                                })}
                                            </Table.Tbody>
                                        </Table>
                                    </Flex>
                                )}
                            </Flex>
                        );
                    })}
            </Flex>
        </Paper>
    );
};
