import type { LayoutAlgorithm, LayoutResult } from "./algorithm";
import type { TokenNode as TokenNodeType } from "../../llm/backend";

export class HangingTreeLayout implements LayoutAlgorithm {
    computeLayout(root: TokenNodeType): LayoutResult {
        const node_grid: {[depth: number]: TokenNodeType[]} = {};
        const layoutResult: LayoutResult = {
            nodes: {},
            connections: {},
        };
        const node_spacing_x = 150;
        const node_spacing_y = 100;
        const root_x = 50;
        const root_y = 50;
        const parent_lookup: {[id: string]: string} = {};
        // Traverse the tree and group nodes by depth
        const traverse = (node: TokenNodeType, depth: number) => {
            if (!node_grid[depth]) {
                node_grid[depth] = [];
            }
            node_grid[depth].push(node);
            node.children.forEach(child => {
                if (!layoutResult.connections[node.id]) {
                    layoutResult.connections[node.id] = [];
                }
                layoutResult.connections[node.id].push(child.id);
                parent_lookup[child.id] = node.id;
                traverse(child, depth + 1);
            });
        };

        traverse(root, 0);
        for (const depth in node_grid) {
            const nodesAtDepth = node_grid[depth];
            if (depth === '0') {
                layoutResult.nodes[root.id] = { x: root_x, y: root_y };
                continue;
            }
            nodesAtDepth.forEach((node, index) => {
                const parentId = parent_lookup[node.id];
                const childIndex = layoutResult.connections[parentId]?.indexOf(node.id) ?? 0;
                const parentPos = parentId ? layoutResult.nodes[parentId] : { x: root_x, y: root_y };
                layoutResult.nodes[node.id] = {
                    x: parseInt(depth) * node_spacing_x,
                    y: Math.max(parentPos.y + childIndex * node_spacing_y, index * node_spacing_y),
                };
            }
            );
        }


        return layoutResult;

    }
}