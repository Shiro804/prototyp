import { LocationFull } from "@/lib/simulation/Simulation";
import { Accordion, Text, Code } from "@mantine/core";
import { InventoryEntriesAccordion } from "./InventoryEntriesAccordion";

interface LocationTreeViewProps {
    location: LocationFull;
}

export function LocationTreeView({ location }: LocationTreeViewProps) {
    return (
        <Accordion multiple variant="contained">
            {/* Allgemeine Infos zur Location */}
            <Accordion.Item value="locationInfo">
                <Accordion.Control>Location Info</Accordion.Control>
                <Accordion.Panel>
                    <Text>ID: {location.id}</Text>
                    <Text>Name: {location.name}</Text>
                    {location.description && <Text>Description: {location.description}</Text>}
                </Accordion.Panel>
            </Accordion.Item>

            {/* ProcessSteps */}
            <Accordion.Item value="processSteps">
                <Accordion.Control>Process Steps ({location.processSteps.length})</Accordion.Control>
                <Accordion.Panel>
                    {location.processSteps.map((ps) => (
                        <Accordion key={ps.id} multiple variant="separated" mt="xs">
                            <Accordion.Item value={`ps-${ps.id}`}>
                                <Accordion.Control>{ps.name}</Accordion.Control>
                                <Accordion.Panel>
                                    <Text>Status: {ps.status}</Text>
                                    <Text>Input Speed: {ps.inputSpeed}</Text>
                                    <Text>Output Speed: {ps.outputSpeed}</Text>
                                    <Text>Recipe Rate: {ps.recipeRate}</Text>

                                    {/* Beispiel: Inventar als JSON anzeigen */}
                                    <Accordion multiple mt="md">
                                        <Accordion.Item value={`ps-${ps.id}-inventory`}>
                                            <Accordion.Control>
                                                Inventory Entries ({ps.inventory.entries.length})
                                            </Accordion.Control>
                                            <Accordion.Panel>
                                                <InventoryEntriesAccordion entries={ps.inventory.entries} />
                                            </Accordion.Panel>
                                        </Accordion.Item>
                                    </Accordion>

                                    {/* Falls du Ressourcen / Worker / Maschinen hast */}
                                    {ps.resources.length > 0 && (
                                        <Accordion multiple mt="md">
                                            <Accordion.Item value={`ps-${ps.id}-resources`}>
                                                <Accordion.Control>Resources ({ps.resources.length})</Accordion.Control>
                                                <Accordion.Panel>
                                                    <Code block>
                                                        {JSON.stringify(ps.resources, null, 2)}
                                                    </Code>
                                                </Accordion.Panel>
                                            </Accordion.Item>
                                        </Accordion>
                                    )}
                                </Accordion.Panel>
                            </Accordion.Item>
                        </Accordion>
                    ))}
                </Accordion.Panel>
            </Accordion.Item>

            {/* Wenn du an anderer Stelle mehr Daten hast, kannst du analog weitere Accordion-Items anlegen */}
            {/* z.B. "location.resources" oder "transportSystems" etc. */}
        </Accordion>
    );
}