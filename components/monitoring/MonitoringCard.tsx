import { FC } from "react";
import { Paper, Table, Flex, Text, Button, Switch, Container, Divider } from "@mantine/core";
import { LocationFull } from "@/lib/simulation/Simulation";
import { groupInventory } from "@/components/helpers";
import { TransportSystem } from "@prisma/client";
import { useSimulationMock } from "../context/SimulationContextMock";

/**
 * Minimal interface: we take a `LocationFull` and an optional `onDetailsClick`.
 */
interface MonitoringCardProps {
    location: LocationFull;
    onDetailsClick?: () => void;
    transportSystems?: TransportSystem[];
}

export const MonitoringCard: FC<MonitoringCardProps> = ({
    location,
    onDetailsClick,
    transportSystems
}) => {
    const { name, processSteps } = location;

    const { toggleTransportSystem, toggleProcessStep } = useSimulationMock();

    return (
        <Paper shadow="md" p="lg" style={{ overflowY: "auto", width: "100%", height: "550px" }} bg="white">
            <Flex direction="column" h="100%">


                <Flex align="center" justify="center" direction="row" w="100%">
                    <Text miw="120px"></Text>
                    <Flex w="100%" direction="row" justify="center" align="center">
                        <Text fw="bold" size="xl">
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
                    .slice() // so reverse() does not mutate
                    .reverse()
                    .map((ps) => (
                        <Flex w="100%" direction="column" key={ps.id}>
                            <Flex align={"center"} justify={"space-between"}>
                                <Text my="md" fw={600}>
                                    {ps.name}
                                </Text>
                                <Switch
                                    checked={ps.active}
                                    onChange={() => toggleProcessStep(ps.id)}
                                />
                            </Flex>
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
                        </Flex>
                    ))}


                {/* Transport Systems */}
                {transportSystems && transportSystems.length > 0 && (
                    <Flex w="100%" direction="column" mt="auto">
                        <Text fw="bold" mt="lg" mb="sm">
                            Transport Systems
                        </Text>
                        <Table withTableBorder>
                            <Table.Thead>
                                <Table.Tr>
                                    <Table.Th>Name</Table.Th>
                                    <Table.Th>Active</Table.Th>
                                </Table.Tr>
                            </Table.Thead>
                            <Table.Tbody>
                                {transportSystems.map((ts) => (
                                    <Table.Tr key={ts.id}>
                                        <Table.Td>{ts.name}</Table.Td>
                                        <Table.Td>
                                            <Switch
                                                checked={ts.active}
                                                onChange={() => toggleTransportSystem(ts.id)}
                                            />
                                        </Table.Td>
                                    </Table.Tr>
                                ))}
                            </Table.Tbody>
                        </Table>
                    </Flex>
                )}
            </Flex>
        </Paper>
    );
};
