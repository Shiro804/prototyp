
import { FunctionComponent } from "react";
import { Button, Card, Center, Flex, Loader, Modal, NumberInput, Text, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustmentsAlt as IconAdjustment } from "@tabler/icons-react";
import ToBeDoneCard from "../custom/ToBeDoneCard";
import { useSimulationMock } from "../SimulationContext";

interface AdjustSimulationParamsProps {
}

const AdjustSimulationParamsModal: FunctionComponent<AdjustSimulationParamsProps> = () => {
    const [opened, { open, close }] = useDisclosure(false);
    // const { speed, setSpeed } = useSimulationMock();

    return (
        <>
            <Modal size="md" bg="white" opened={opened} onClose={close} title="Adjust Simulation Parameters">
                {/* <Flex mt="10px" gap="md" justify="flex-start" align="flex-start" direction="row">
                    <Text>Speed: </Text>
                    <NumberInput defaultValue={speed} allowDecimal={true} onChange={value => {
                        console.log(value)
                        console.log(typeof value === 'number')
                        console.log(speed)
                        setSpeed(typeof value === 'number' ? value : 1)

                    }}></NumberInput>
                </Flex> */}
                <ToBeDoneCard />
            </Modal >
            <Tooltip label="Open Simulation Configuration"
                position="bottom"
                color="indigo"
                radius="md"
                offset={10}
                withArrow>

                <Button color="indigo" onClick={open}>
                    <IconAdjustment />
                </Button>
            </Tooltip>
        </>
    );
}

export default AdjustSimulationParamsModal;
