// MaterialFlowGraph.tsx

"use client";

import { Box, Button, LoadingOverlay } from "@mantine/core";
import {
    Background,
    Controls,
    Edge,
    OnSelectionChangeFunc,
    Panel,
    ReactFlow,
    ReactFlowProvider,
    useEdgesState,
    useNodesState,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useCallback, useEffect, useState } from "react";
import { MaterialFlowNodeTypes, MaterialNodeType } from "./nodesMaterial";
import { MaterialSelectedEntity } from "./nodesMaterial";
import { getLayoutedElements } from "../simulation-overview/layout";
import { EntityInfo } from "../simulation-overview/EntityInfo";

// Import your live simulation context hook
import { useSimulationLive } from "@/components/context/SimulationContextLive";

/**
 * A new Graph that includes materials as nodes, in addition to process steps & transport systems.
 * On click, show data about the material or process step or transport system, similarly to SimulationGraph.
 */
export interface MaterialFlowGraphProps { }

export function MaterialFlowGraph({ }: Readonly<MaterialFlowGraphProps>) {
    const [nodes, setNodes, onNodesChange] = useNodesState<MaterialNodeType>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [selectedEntity, setSelectedEntity] = useState<MaterialSelectedEntity>();
    const [layout, setLayout] = useState<"TB" | "LR">("TB");

    // Access the live simulation from context
    const { simulation, frame } = useSimulationLive();

    useEffect(() => {
        if (!simulation) return; // If simulation not loaded yet, do nothing

        // Get the current frame's entity state
        const currentFrame = simulation.frames[frame];
        if (!currentFrame) return;

        const entities = currentFrame.state; // This is your SimulationEntityState

        let newNodes: Record<string, MaterialNodeType> = {};
        let newEdges: Record<string, Edge> = {};

        // --- A) Process Steps as nodes
        for (const loc of entities.locations) {
            for (const ps of loc.processSteps) {
                const nodeId = "ps-" + ps.id;
                if (!newNodes[nodeId]) {
                    newNodes[nodeId] = {
                        id: nodeId,
                        position: { x: 0, y: 0 },
                        data: { name: ps.name, location: loc.name, entity: ps },
                        type: "processStep",
                    };
                }
            }
        }

        // --- B) Transport Systems as nodes
        for (const loc of entities.locations) {
            for (const ps of loc.processSteps) {
                for (const ts of ps.inputs.concat(ps.outputs)) {
                    const tsId = "ts-" + ts.id;
                    if (!newNodes[tsId]) {
                        newNodes[tsId] = {
                            id: tsId,
                            position: { x: 0, y: 0 },
                            data: { name: ts.name, entity: ts },
                            type: "transportSystem",
                        };
                    }

                    const inEdgeId = "ps-" + ts.startStepId + "-ts-" + ts.id;
                    const outEdgeId = "ts-" + ts.id + "-ps-" + ts.endStepId;

                    if (!newEdges[inEdgeId]) {
                        newEdges[inEdgeId] = {
                            id: inEdgeId,
                            source: "ps-" + ts.startStepId,
                            target: tsId,
                            animated: true,
                        };
                    }
                    if (!newEdges[outEdgeId]) {
                        newEdges[outEdgeId] = {
                            id: outEdgeId,
                            source: tsId,
                            target: "ps-" + ts.endStepId,
                            animated: true,
                        };
                    }
                }
            }
        }

        // --- C) Materials as nodes (only with orderId)
        for (const loc of entities.locations) {
            for (const ps of loc.processSteps) {
                for (const item of ps.inventory.entries.filter(item => item.orderId != null)) {
                    const matNodeId = "mat-" + item.id;
                    newNodes[matNodeId] = {
                        id: matNodeId,
                        position: { x: 0, y: 0 },
                        data: {
                            materialName: item.material,
                            entity: item,
                        },
                        type: "material",
                    };
                    const edgeId = "ps-" + ps.id + "-mat-" + item.id;
                    if (!newEdges[edgeId]) {
                        newEdges[edgeId] = {
                            id: edgeId,
                            source: "ps-" + ps.id,
                            target: matNodeId,
                            animated: true,
                        };
                    }
                }
            }
            for (const ps of loc.processSteps) {
                for (const ts of ps.inputs.concat(ps.outputs)) {
                    for (const item of ts.inventory.entries.filter(item => item.orderId != null)) {
                        const matNodeId = "mat-" + item.id;
                        newNodes[matNodeId] = {
                            id: matNodeId,
                            position: { x: 0, y: 0 },
                            data: {
                                materialName: item.material,
                                entity: item,
                            },
                            type: "material",
                        };
                        const edgeId = "ts-" + ts.id + "-mat-" + item.id;
                        if (!newEdges[edgeId]) {
                            newEdges[edgeId] = {
                                id: edgeId,
                                source: "ts-" + ts.id,
                                target: matNodeId,
                                animated: true,
                            };
                        }
                    }
                }
            }
        }

        setNodes(Object.values(newNodes));
        setEdges(Object.values(newEdges));
    }, [simulation, frame]);

    const onSelectionChange = useCallback<OnSelectionChangeFunc>(({ nodes }) => {
        if (nodes[0]) {
            const node = nodes[0] as MaterialNodeType;
            if (node.type === "processStep") {
                setSelectedEntity({ type: "processStep", data: node.data });
            } else if (node.type === "transportSystem") {
                setSelectedEntity({ type: "transportSystem", data: node.data });
            } else if (node.type === "material") {
                setSelectedEntity({ type: "material", data: node.data });
            }
        } else {
            setSelectedEntity(undefined);
        }
    }, []);

    const layoutedGraph =
        nodes.length > 0 && edges.length > 0
            ? getLayoutedElements(nodes, edges, { direction: layout })
            : { nodes: [], edges: [] };

    return (
        <Box w="100%" h={700}>
            <LoadingOverlay
                visible={layoutedGraph.nodes.length === 0}
                zIndex={1000}
                overlayProps={{ radius: "sm", blur: 2 }}
            />
            <ReactFlow
                nodes={layoutedGraph.nodes}
                edges={layoutedGraph.edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onSelectionChange={onSelectionChange}
                nodeTypes={MaterialFlowNodeTypes}
                minZoom={0.2}
                fitView
            >
                <Background />
                <Controls />
                <Panel position="top-right">
                    <Button size="xs" mr={10} onClick={() => setLayout("TB")}>
                        Vertical layout
                    </Button>
                    <Button size="xs" onClick={() => setLayout("LR")}>
                        Horizontal layout
                    </Button>
                </Panel>
            </ReactFlow>
            {selectedEntity && <EntityInfo entity={selectedEntity} />}
        </Box>
    );
}

export function MaterialFlowGraphWithProvider(props: MaterialFlowGraphProps) {
    return (
        <ReactFlowProvider>
            <MaterialFlowGraph {...props} />
        </ReactFlowProvider>
    );
}