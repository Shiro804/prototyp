// nodesMaterial.ts

import React from "react";
import { Handle, Node, NodeProps, Position } from "@xyflow/react";
import "./materialOverviewNodes.css";

/**
 * We'll define 4 node interfaces:
 *  - ProcessStep
 *  - TransportSystem
 *  - Resource
 *  - Material
 */

// ----------------------------
// 1) PROCESS STEP
// ----------------------------
export type MaterialProcessStepNode = Node<
    {
        name: string;
        location: string;
        entity: object;
    },
    "processStep"
>;

export function MaterialProcessStepNode({
    data,
}: NodeProps<MaterialProcessStepNode>) {
    return (
        <div className="processStepNode">
            <span className="location">{data.location}</span>
            <span className="name">{data.name}</span>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

// ----------------------------
// 2) TRANSPORT SYSTEM
// ----------------------------
export type MaterialTransportSystemNode = Node<
    {
        name: string;
        entity: object;
    },
    "transportSystem"
>;

export function MaterialTransportSystemNode({
    data,
}: NodeProps<MaterialTransportSystemNode>) {
    return (
        <div className="transportSystemNode">
            <span className="name">{data.name}</span>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

// ----------------------------
// 3) RESOURCE
// ----------------------------
export type MaterialResourceNode = Node<
    {
        name: string;
        entity: object;
    },
    "resource"
>;

export function MaterialResourceNodeComponent({
    data,
}: NodeProps<MaterialResourceNode>) {
    return (
        <div className="resourceNode">
            <span className="resourceName">{data.name}</span>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

// ----------------------------
// 4) MATERIAL
// ----------------------------
export type MaterialNode = Node<
    {
        materialName: string;
        entity: object;
    },
    "material"
>;

export function MaterialNodeComponent({ data }: NodeProps<MaterialNode>) {
    return (
        <div className="materialNode">
            <span className="materialName">{data.materialName}</span>
            <Handle type="target" position={Position.Top} />
            <Handle type="source" position={Position.Bottom} />
        </div>
    );
}

export type MaterialNodeType =
    | MaterialProcessStepNode
    | MaterialTransportSystemNode
    | MaterialResourceNode
    | MaterialNode;

export const MaterialFlowNodeTypes = {
    processStep: MaterialProcessStepNode,
    transportSystem: MaterialTransportSystemNode,
    resource: MaterialResourceNodeComponent,
    material: MaterialNodeComponent,
};

// ---------------------------------
// SelectedEntity shape
// ---------------------------------
export type MaterialSelectedEntity =
    | {
        type: "processStep";
        data: MaterialProcessStepNode["data"];
    }
    | {
        type: "transportSystem";
        data: MaterialTransportSystemNode["data"];
    }
    | {
        type: "resource";
        data: MaterialResourceNode["data"];
    }
    | {
        type: "material";
        data: MaterialNode["data"];
    };
