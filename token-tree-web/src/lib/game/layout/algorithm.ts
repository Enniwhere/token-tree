import type { TokenNode } from "../../llm/backend";


export interface Point {
    x: number;
    y: number;
}

export interface LayoutResult {
    nodes: { [id: string] : Point; };
    connections: { [id: string]: string[]; }; // parentId -> childIds
}

export interface LayoutAlgorithm {
    computeLayout(root: TokenNode): LayoutResult;
}