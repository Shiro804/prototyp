import { Title } from "@mantine/core";

import { SimulationGraph } from "@/components/simulation-overview/SimulationGraph";

export default async function SimulationOverview() {
  return (
    <>
      <Title>Simulation Graph</Title>
      <SimulationGraph />
    </>
  );
}
