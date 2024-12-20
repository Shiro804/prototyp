import { Button, Container, Flex, Text, Tooltip } from "@mantine/core";
import {
  IconPlayerPause as IconPause,
  IconPlayerPlay as IconPlay,
  IconRotateDot,
} from "@tabler/icons-react";
import { FunctionComponent } from "react";

import AdjustSimulationParams from "./modals/AdjustSimulationParamsModal";
import { useSimulation1 } from "./SimulationContext";

interface SimulationControlOverlayProps { }

const SimulationControlOverlay: FunctionComponent<
  SimulationControlOverlayProps
> = () => {
  const { load, toggle, playing, loading, simulation } = useSimulation1();

  return (
    <Flex>
      <Container>
        <Flex
          gap="lg"
          justify="flex-start"
          align="center"
          direction="row"
          wrap="nowrap"
        >
          <Text size="md" fw={700}>
            Simulation Control Settings:
          </Text>
          <Flex
            gap="xs"
            justify="flex-start"
            align="flex-start"
            direction="row"
            wrap="nowrap"
          >
            <Tooltip label="Calculate Simulation"
              position="bottom"
              color="indigo"
              radius="md"
              offset={10}
              withArrow>
              <Button color="indigo" onClick={() => load(1000)} loading={loading}>
                <IconRotateDot />
              </Button>
            </Tooltip>
            <Tooltip label="Play and Stop Simulation"
              position="bottom"
              color="indigo"
              radius="md"
              offset={10}
              withArrow>
              <Button
                color="indigo"
                disabled={simulation === undefined}
                onClick={toggle}
                loading={loading}
              >
                {playing ? <IconPause /> : <IconPlay />}
              </Button>

            </Tooltip>

            <AdjustSimulationParams />
          </Flex>
        </Flex>
      </Container >
    </Flex >
  );
};

export default SimulationControlOverlay;
