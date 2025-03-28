import { Edge, Node, useNodesInitialized, useReactFlow } from "@xyflow/react";
import type { LayoutOptions as ELKOptions, ElkNode } from "elkjs";
import ELK from "elkjs/lib/elk.bundled.js";
import { useEffect } from "react";
import { NodeType } from "./nodes";

export interface LayoutOptions {
  direction: "DOWN" | "RIGHT";
}

export interface LayoutedGraph<N extends Node = Node, E extends Edge = Edge> {
  nodes: N[];
  edges: E[];
}

const elk = new ELK();

export async function getLayoutedElements<
  N extends Node = Node,
  E extends Edge = Edge,
>(
  nodes: N[],
  edges: E[],
  options: LayoutOptions,
): Promise<LayoutedGraph<N, E>> {
  const elkOptions: ELKOptions = {
    "elk.algorithm": "layered",
    "elk.direction": options.direction,
    "elk.layered.spacing.nodeNodeBetweenLayers": "100",
    "elk.spacing.nodeNode": "80",
  };

  const graph: ElkNode = {
    id: "root",
    layoutOptions: elkOptions,
    children: nodes.map((n) => ({
      ...n,
      width: n.measured?.width,
      height: n.measured?.height,
    })),
    edges: edges.map((e) => ({
      ...e,
      sources: [e.source],
      targets: [e.target],
    })),
  };

  let children: ElkNode[] = [];
  try {
    const result = await elk.layout(graph);
    children = result.children ?? [];
  } catch (e) {
    console.error(e);
  }

  return {
    nodes: nodes.map((n) => {
      const child = children.find((c) => c.id === n.id);

      if (child && child.x && child.y) {
        n.position.x = child.x;
        n.position.y = child.y;
      }

      return n;
    }),
    edges,
  };
}

export function useLayout({ direction }: LayoutOptions) {
  const { getNodes, setNodes, getEdges, setEdges } = useReactFlow<NodeType>();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    const nodes = getNodes();

    if (nodesInitialized && nodes.some((n) => n.id.endsWith("-unlayouted"))) {
      getLayoutedElements(nodes, getEdges(), { direction }).then((g) => {
        setNodes([
          ...g.nodes
            .filter((n) => n.id.endsWith("-unlayouted"))
            .map((n) => {
              if (n.style?.opacity !== undefined) {
                n.style.opacity = 1;
              }
              n.id = n.id.replace(/-unlayouted$/, "");
              return n;
            }),
        ]);
        setEdges([
          ...g.edges
            .filter((e) => e.id.endsWith("-unlayouted"))
            .map((e) => {
              if (e.style?.opacity !== undefined) {
                e.style = { ...e.style, opacity: 1 };
              }
              e.id = e.id.replace(/-unlayouted$/, "");
              e.source = e.source.replace(/-unlayouted$/, "");
              e.target = e.target.replace(/-unlayouted$/, "");
              return e;
            }),
        ]);
      });
    }
  }, [direction, getEdges, getNodes, nodesInitialized, setEdges, setNodes]);
}
