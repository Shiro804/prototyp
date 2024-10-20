import { FunctionComponent } from "react";
import { Button, Card, Center, Loader, Modal, TextInput, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustmentsAlt as IconAdjustment } from "@tabler/icons-react";
import ToBeDoneCard from "../custom/ToBeDoneCard";



interface AdjustSimulationParamsProps {
}

const AdjustSimulationParamsModal: FunctionComponent<AdjustSimulationParamsProps> = () => {
    const [opened, { open, close }] = useDisclosure(false);

    return (
        <>
            <Modal opened={opened} onClose={close} title="Adjust Simulation Parameters">
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