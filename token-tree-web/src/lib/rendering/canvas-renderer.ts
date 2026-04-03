import type { LayoutResult } from "../game/layout/algorithm";
import type { TokenNode as TokenNodeType } from "../llm/backend";

export class CanvasRenderer {
    private ctx: CanvasRenderingContext2D;
    constructor(private canvas: HTMLCanvasElement) {
        const ctx = canvas.getContext("2d");
        if (!ctx) {
            throw new Error("Failed to get 2D context");
        }
        this.ctx = ctx;
    }

    resize(width: number, height: number): void {
        this.canvas.width = width;
        this.canvas.height = height;
    }

    render(root: TokenNodeType, layout: LayoutResult): void {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw connections
        this.drawConnections(root, layout);
        // Draw nodes
        this.drawNodes(root, layout);
    }

    private drawConnections(node: TokenNodeType, layout: LayoutResult): void {
        const queue: TokenNodeType[] = [node];
        this.ctx.strokeStyle = "#888";
        while (queue.length > 0) {
            const current = queue.shift()!;
            const currentPos = layout.nodes[current.id];
            current.children.forEach(child => {
                const childPos = layout.nodes[child.id];
                this.ctx.lineWidth = Math.max(1, 20 * child.cumprob);
                this.ctx.beginPath();
                this.ctx.moveTo(currentPos.x, currentPos.y);
                this.ctx.lineTo(childPos.x, childPos.y);
                this.ctx.stroke();
                queue.push(child);
            });
        }
    }

    private drawNodes(node: TokenNodeType, layout: LayoutResult): void {
        const queue: TokenNodeType[] = [node];
        while (queue.length > 0) {
            const current = queue.shift()!;
            const currentPos = layout.nodes[current.id];
            this.ctx.fillStyle = "#fff";
            this.ctx.beginPath();
            this.ctx.arc(currentPos.x, currentPos.y, 25, 0, 2 * Math.PI);
            this.ctx.fill();
            this.ctx.strokeStyle = "#000";
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
            // Draw token text
            this.ctx.fillStyle = "#000";
            this.ctx.font = "12px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "middle";
            this.ctx.fillText(current.token, currentPos.x, currentPos.y);
            queue.push(...current.children);
        }
    }

    getNodeAtPosition(x: number, y: number, layout: LayoutResult): string | null {
        const nodeRadius = 25;
    
        for (const [nodeId, pos] of Object.entries(layout.nodes)) {
            const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
            if (distance <= nodeRadius) {
                return nodeId;
            }
        }
    
        return null; // No node clicked
    }
}