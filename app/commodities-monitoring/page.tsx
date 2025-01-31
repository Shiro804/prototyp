// "use client";

// import { Flex, Paper, SimpleGrid, Table, Text, Title } from "@mantine/core";
// import { FC, ReactNode, useEffect } from "react";

// import { Prisma } from "@prisma/client";
// import { groupInventory } from "../incoming-goods/helpers";
// import { useSimulationMock } from "@/components/SimulationContextMock";

// interface LocationCardProps {
//   name: ReactNode;
//   processSteps: Prisma.ProcessStepGetPayload<{
//     include: { inventory: { include: { entries: true } } };
//   }>[];
// }

// const LocationCard: FC<LocationCardProps> = ({ name, processSteps }) => (
//   <Paper shadow="sm" p="lg">
//     <Text fw="bold" size="lg" mb="md">
//       {name}
//     </Text>
//     {processSteps.reverse().map((ps) => (
//       <>
//         <Text fw="600">{ps.name}</Text>
//         <Table withTableBorder>
//           <Table.Thead>
//             <Table.Tr>
//               <Flex gap="md" justify="space-between" align="flex-start" direction="row" wrap="nowrap">
//                 <Table.Th fw={600}>Material</Table.Th>
//                 <Table.Th fw={600}>Count</Table.Th>
//               </Flex>
//             </Table.Tr>
//           </Table.Thead>
//           <Table.Tbody>
//             {Object.entries(groupInventory(ps.inventory)).map(
//               ([material, count]) => (
//                 <Table.Tr key={material}>
//                   <Flex gap="md" justify="space-between" align="flex-start" direction="row" wrap="nowrap">
//                     <Table.Td fw={600}>{material}</Table.Td>
//                     <Table.Td fw={600}>{count}</Table.Td>
//                   </Flex>
//                 </Table.Tr>
//               )
//             )}
//           </Table.Tbody>
//         </Table>
//       </>
//     ))}
//   </Paper>
// );

// export default function CommoditiesMonitoring() {
//   const { simulation, frame, speed, setSpeed, toggle } = useSimulationMock();

//   useEffect(() => {
//     console.log("commodities set speed")
//     setSpeed(1)
//   }, []);

//   useEffect(() => {
//     console.log(simulation);
//   }, [simulation]);

//   return (
//     <>
//       <Title>Commodities</Title>
//       <SimpleGrid cols={{ base: 1, md: 2 }}>
//         {simulation?.frames[frame].locations.map((l) => (
//           <LocationCard
//             key={l.id}
//             name={l.name}
//             processSteps={l.processSteps}
//           />
//         ))}
//       </SimpleGrid>
//     </>
//   );
// }
