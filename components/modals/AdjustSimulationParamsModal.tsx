
import { FunctionComponent } from "react";
import { Button, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconAdjustmentsAlt as IconAdjustment } from "@tabler/icons-react";
import { PRIMARY } from "@/lib/theme";

interface AdjustSimulationParamsProps {
}

const AdjustSimulationParamsModal: FunctionComponent<AdjustSimulationParamsProps> = () => {
    const [opened, { open, close }] = useDisclosure(false);
    // const { speed, setSpeed } = useSimulationMock();

    return (
        <>
            <Tooltip label="Open Simulation Configuration"
                position="bottom"
                radius="md"
                offset={10}
                withArrow>

                <Button color={PRIMARY} onClick={open}>
                    <IconAdjustment />
                </Button>
            </Tooltip>
        </>
    );
}

export default AdjustSimulationParamsModal;
