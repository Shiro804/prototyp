import { Title } from "@mantine/core";

import { SimulationGraphWithProvider } from "@/components/simulation-overview/SimulationGraph";

export default async function SimulationOverview() {
  return (
    <>
      <Title>Simulation Graph</Title>
      <SimulationGraphWithProvider />
    </>
  );
}
