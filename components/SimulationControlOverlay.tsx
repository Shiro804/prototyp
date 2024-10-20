import { useState } from "react";
import { Button, Container, Flex, Text } from "@mantine/core";
import { IconPlayerPlay as IconPlay, IconPlayerPause as IconPause, IconAdjustmentsAlt as IconAdjustment } from "@tabler/icons-react";
import { FunctionComponent } from "react";
import AdjustSimulationParams from "./modals/AdjustSimulationParamsModal";
import { useDisclosure } from "@mantine/hooks";

interface SimulationControlOverlayProps { }

const SimulationControlOverlay: FunctionComponent<SimulationControlOverlayProps> = () => {
    // State to track if the simulation is running (true = playing, false = paused)
    const [isPlaying, setIsPlaying] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    // Function to toggle the play/pause state
    const togglePlayPause = () => {
        setIsPlaying((prev) => !prev);
    };

    return (
        <Flex>
            <Container>
                <Flex gap="lg" justify="flex-start" align="center" direction="row" wrap="nowrap">

                    <Text
                        size="md"
                        fw={700}
                    >
                        Simulation Control Settings:
                    </Text>
                    <Flex gap="xs" justify="flex-start" align="flex-start" direction="row" wrap="nowrap">

                        <Button color="indigo" onClick={togglePlayPause}>
                            {isPlaying ? <IconPause /> : <IconPlay />}
                        </Button>
                        <AdjustSimulationParams />
                    </Flex>
                </Flex>
            </Container>
        </Flex>
    );
};

export default SimulationControlOverlay;
