import { FC } from "react";
import {
    Paper,
    Table,
    Flex,
    Text,
    Button,
    Switch,
    Divider,
} from "@mantine/core";
import { LocationFull } from "@/lib/simulation/Simulation";
import { groupInventory } from "@/components/helpers";
import { useSimulationMock } from "../context/SimulationContextMock";

/**
 * Minimal interface: we take a `LocationFull` and an optional `onDetailsClick`.
 */
interface MonitoringCardProps {
    location: LocationFull;
    onDetailsClick?: () => void;
}

export const MonitoringCard: FC<MonitoringCardProps> = ({
    location,
    onDetailsClick,
}) => {
    const { name, processSteps } = location;
    const { toggleProcessStep, toggleTransportSystem, toggleResource } =
        useSimulationMock();

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

                    {/* Button to trigger detailed view */}
                    {onDetailsClick && (
                        <Button
                            miw="120px"
                            ml="auto"
                            variant="gradient"
                            onClick={onDetailsClick}
                            bg={"#5300E8"}
                        >
                            View Details
                        </Button>
                    )}
                </Flex>

                {/* SUMMARY: For each ProcessStep, show inventory & transportSystems & resources */}
                {processSteps
                    .slice()
                    .reverse()
                    .map((ps) => (
                        <Flex
                            w="100%"
                            direction="column"
                            key={ps.id}
                            bg="#28252D"
                            p={10}
                            mb={20}
                            style={{ borderRadius: "10px" }}
                        >
                            <Flex align="center" justify="space-between">
                                <Text my="md" fw={600}>
                                    # Process Step: {ps.name}
                                </Text>
                                <Switch
                                    color="#5300E8"
                                    checked={ps.active}
                                    onChange={() => toggleProcessStep(ps.id)}
                                />
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
                                            <Table.Th fw={700}>Material</Table.Th>
                                            <Table.Th fw={700}>Count</Table.Th>
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
                                                    <Table.Th fw={700}>Transport System</Table.Th>
                                                    <Table.Th fw={700}>Active</Table.Th>
                                                </Flex>
                                            </Table.Tr>
                                        </Table.Thead>
                                        <Table.Tbody>
                                            {ps.outputs.map((ts) => (
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
                                                            <Switch
                                                                color="#5300E8"
                                                                checked={ts.active}
                                                                onChange={() => toggleTransportSystem(ts.id)}
                                                            />
                                                        </Table.Td>
                                                    </Flex>
                                                </Table.Tr>
                                            ))}
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
                                                                color="#5300E8"
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
            </Flex>
        </Paper>
    );
};
