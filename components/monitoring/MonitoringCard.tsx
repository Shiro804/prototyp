import { FC } from "react";
import {
    Paper,
    Table,
    Flex,
    Text,
    Button,
    Switch,
    Container,
    Divider,
} from "@mantine/core";
import { LocationFull, TransportSystemFull } from "@/lib/simulation/Simulation";
import { groupInventory } from "@/components/helpers";
import { useSimulationMock } from "../context/SimulationContextMock";

/**
 * Minimal interface: we take a `LocationFull` and an optional `onDetailsClick`.
 */
interface MonitoringCardProps {
    location: LocationFull;
    onDetailsClick?: () => void;
    transportSystems?: TransportSystemFull[];
}

export const MonitoringCard: FC<MonitoringCardProps> = ({
    location,
    onDetailsClick,
    transportSystems,
}) => {
    const { name, processSteps } = location;
    const { toggleTransportSystem, toggleProcessStep, toggleResource } = useSimulationMock();

    return (
        <Paper
            shadow="md"
            p="lg"
            style={{ overflowY: "auto", width: "100%", height: "550px" }}
            bg="white"
        >
            <Flex direction="column" h="100%">
                <Flex align="center" justify="center" direction="row" w="100%">
                    <Text miw="120px"></Text>
                    <Flex w="100%" direction="row" justify="center" align="center">
                        <Text fw="bold" size="lg">
                            {name}
                        </Text>
                    </Flex>

                    {/* Button to trigger detailed view */}
                    {onDetailsClick && (
                        <Button miw="120px" ml="auto" variant="gradient" onClick={onDetailsClick}>
                            View Details
                        </Button>
                    )}
                </Flex>

                {/* SUMMARY: For each ProcessStep, show grouped inventory in a Table */}
                {processSteps
                    .slice() // so reverse() does not mutate the original array
                    .reverse()
                    .map((ps) => (
                        <Flex w="100%" direction="column" key={ps.id}>
                            <Flex align="center" justify="space-between">
                                <Text my="md" fw={600}>
                                    {ps.name}
                                </Text>
                                <Switch checked={ps.active} onChange={() => toggleProcessStep(ps.id)} />
                            </Flex>

                            {/* Table for the materials in this process step */}
                            <Table withRowBorders highlightOnHover>
                                <Table.Thead>
                                    <Table.Tr>
                                        <Flex
                                            gap="md"
                                            justify="space-between"
                                            align="flex-start"
                                            direction="row"
                                            wrap="nowrap"
                                        >
                                            <Table.Th fw={700}>Material</Table.Th>
                                            <Table.Th fw={600}>Count</Table.Th>
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
                                        ),
                                    )}
                                </Table.Tbody>
                            </Table>

                            {/* New Table for the resources of this process step */}
                            {ps.resources && ps.resources.length > 0 && (
                                <Flex direction="column" mt="md">
                                    <Text fw={600} mb="xs">
                                        Process Step Resources
                                    </Text>
                                    <Table withRowBorders highlightOnHover>
                                        <Table.Thead>
                                            <Table.Tr>
                                                <Flex
                                                    gap="md"
                                                    justify="space-between"
                                                    align="flex-start"
                                                    direction="row"
                                                    wrap="nowrap"
                                                >
                                                    <Table.Th fw={700}>Resource</Table.Th>
                                                    <Table.Th fw={700}>Active</Table.Th>
                                                </Flex>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {ps.resources.map((r) => (
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
                                                            <Switch
                                                                key={r.id}
                                                                checked={r.active}
                                                                onChange={() => toggleResource(r)}
                                                            />
                                                        </Table.Td>
                                                    </Flex>
                                                </Table.Tr>
                                            ))}
                                        </Table.Tbody>
                                    </Table>
                                </Flex>
                            )}
                        </Flex>
                    ))}

                {/* Transport Systems */}
                {transportSystems && transportSystems.length > 0 && (
                    <Flex w="100%" direction="column" mt="auto">
                        <Divider mt="auto" mb={10} label="Transport Systems" />
                        {transportSystems.map((ts) => (
                            <Flex direction="column" key={ts.id} mb="sm">
                                <Flex align="center" justify="space-between">
                                    <Text fw={600}># {ts.name}</Text>
                                    <Switch
                                        checked={ts.active}
                                        onChange={() => toggleTransportSystem(ts.id)}
                                    />
                                </Flex>

                                {/* New table for this transport system's resources */}
                                {ts.resources && ts.resources.length > 0 && (
                                    <Flex direction="column" mt="md">
                                        <Table withRowBorders highlightOnHover>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Flex
                                                        gap="md"
                                                        justify="space-between"
                                                        align="flex-start"
                                                        direction="row"
                                                        wrap="nowrap"
                                                    >
                                                        <Table.Th fw={700}>Resource</Table.Th>
                                                        <Table.Th fw={700}>Active</Table.Th>
                                                    </Flex>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {ts.resources.map((r) => (
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
                                                                <Switch
                                                                    checked={r.active}
                                                                    onChange={() => {
                                                                        /* toggle TS resource logic can go here */
                                                                    }}
                                                                />
                                                            </Table.Td>
                                                        </Flex>
                                                    </Table.Tr>
                                                ))}
                                            </Table.Tbody>
                                        </Table>
                                    </Flex>
                                )}
                            </Flex>
                        ))}
                    </Flex>
                )}
            </Flex>
        </Paper>
    );
};
