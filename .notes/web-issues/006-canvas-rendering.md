# Issue 6: Implement Canvas rendering system

## Description

Create a rendering system that visualizes the token tree with main path, alternative branches, and probability-based thickness. Use layered rendering for visual clarity and smooth transitions.

**Tutorial Focus**: This issue introduces HTML5 Canvas in depth. You'll learn how to draw shapes, lines, and text on Canvas, handle hit detection, and implement smooth animations with requestAnimationFrame.

## Tasks

- [ ] Create CanvasRenderer class (`src/lib/rendering/canvas-renderer.ts`):
  ```typescript
  // Learn: Canvas API, drawing primitives
  export class CanvasRenderer {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private positions: Map<string, Point> = new Map();
    private connections: Connection[] = [];

    constructor(canvas: HTMLCanvasElement) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d')!;
      this.resize();
    }

    resize(): void {
      const rect = this.canvas.parentElement!.getBoundingClientRect();
      this.canvas.width = rect.width;
      this.canvas.height = rect.height;
    }

    setLayout(layout: LayoutResult): void {
      this.positions = layout.positions;
      this.connections = layout.connections;
    }

    render(): void {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      // Layer 1: Alternative connections (bottom)
      this.drawAlternativeConnections();

      // Layer 2: Main path
      this.drawMainPath();

      // Layer 3: Branch paths
      this.drawBranchPaths();

      // Layer 4: Token nodes (top)
      this.drawTokenNodes();
    }

    private drawMainPath(): void {
      // Learn: Drawing lines with varying thickness
      const mainConnections = this.connections.filter(c => c.type === 'main');

      if (mainConnections.length === 0) return;

      this.ctx.beginPath();
      this.ctx.strokeStyle = '#4a90e2';
      this.ctx.lineCap = 'round';
      this.ctx.lineJoin = 'round';

      // Draw path with varying thickness
      for (let i = 0; i < mainConnections.length; i++) {
        const conn = mainConnections[i];
        const from = this.positions.get(conn.from)!;
        const to = this.positions.get(conn.to)!;

        // Calculate thickness based on cumulative probability
        const thickness = this.calculateThickness(conn.to);

        this.ctx.lineWidth = thickness;

        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
      }
    }

    private drawAlternativeConnections(): void {
      // Learn: Drawing bezier curves, opacity
      const altConnections = this.connections.filter(c => c.type === 'alternative');

      this.ctx.strokeStyle = 'rgba(153, 153, 153, 0.15)';
      this.ctx.lineWidth = 2;

      altConnections.forEach(conn => {
        const from = this.positions.get(conn.from)!;
        const to = this.positions.get(conn.to)!;

        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);

        // Draw bezier curve
        const cp1x = from.x + (to.x - from.x) * 0.5;
        const cp1y = from.y;
        const cp2x = from.x + (to.x - from.x) * 0.5;
        const cp2y = to.y;

        this.ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, to.x, to.y);
        this.ctx.stroke();
      });
    }

    private drawBranchPaths(): void {
      // Learn: Drawing colored paths
      const branchConnections = this.connections.filter(c => c.type === 'branch');

      branchConnections.forEach(conn => {
        const from = this.positions.get(conn.from)!;
        const to = this.positions.get(conn.to)!;

        this.ctx.strokeStyle = conn.branchId ? this.getBranchColor(conn.branchId) : '#999';
        this.ctx.lineWidth = this.calculateThickness(conn.to);

        this.ctx.beginPath();
        this.ctx.moveTo(from.x, from.y);
        this.ctx.lineTo(to.x, to.y);
        this.ctx.stroke();
      });
    }

    private drawTokenNodes(): void {
      // Learn: Drawing text, hit detection
      this.positions.forEach((pos, tokenId) => {
        const token = this.getTokenById(tokenId);
        if (!token) return;

        // Draw token background
        this.ctx.fillStyle = token.is_main_path ? '#fff' : '#f5f5f5';
        this.ctx.fillRect(pos.x - 20, pos.y - 15, 40, 30);

        // Draw token text
        this.ctx.fillStyle = token.is_main_path ? '#2c3e50' : '#7f8c8d';
        this.ctx.font = token.is_main_path ? '18px sans-serif' : '14px sans-serif';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(token.text, pos.x, pos.y);
      });
    }

    private calculateThickness(tokenId: string): number {
      // Calculate thickness based on cumulative probability
      const token = this.getTokenById(tokenId);
      if (!token) return 8;

      const minThickness = 8;
      const maxThickness = 60;
      return minThickness + (maxThickness - minThickness) * token.cumulative_probability;
    }

    private getBranchColor(branchId: string): string {
      // Get color for branch
    }

    private getTokenById(tokenId: string): TokenData | undefined {
      // Get token data
    }
  }
  ```

- [ ] Create CanvasContainer component (`src/components/CanvasContainer.svelte`):
  ```svelte
  <script>
    // Learn: Canvas lifecycle, onMount
    import { onMount, onDestroy } from 'svelte';
    import { CanvasRenderer } from '$lib/rendering/canvas-renderer';

    let canvasElement;
    let renderer: CanvasRenderer;

    onMount(() => {
      // Learn: Initialize Canvas after component mounts
      renderer = new CanvasRenderer(canvasElement);

      // Handle resize
      window.addEventListener('resize', handleResize);

      // Start render loop
      requestAnimationFrame(renderLoop);
    });

    onDestroy(() => {
      // Learn: Cleanup on component unmount
      window.removeEventListener('resize', handleResize);
    });

    function handleResize() {
      renderer.resize();
    }

    function renderLoop() {
      renderer.render();
      requestAnimationFrame(renderLoop);
    }
  </script>

  <div class="canvas-container">
    <canvas bind:this={canvasElement}></canvas>
  </div>

  <style>
    .canvas-container {
      width: 100%;
      height: 100%;
      position: relative;
    }

    canvas {
      display: block;
      width: 100%;
      height: 100%;
    }
  </style>
  ```

- [ ] Add zoom and pan support:
  ```typescript
  export class CanvasRenderer {
    private scale = 1;
    private offsetX = 0;
    private offsetY = 0;

    zoom(delta: number, centerX: number, centerY: number): void {
      const zoomFactor = delta > 0 ? 1.1 : 0.9;
      const newScale = Math.max(0.5, Math.min(3, this.scale * zoomFactor));

      // Zoom toward center point
      this.offsetX = centerX - (centerX - this.offsetX) * (newScale / this.scale);
      this.offsetY = centerY - (centerY - this.offsetY) * (newScale / this.scale);
      this.scale = newScale;
    }

    pan(dx: number, dy: number): void {
      this.offsetX += dx;
      this.offsetY += dy;
    }

    private applyTransform(): void {
      this.ctx.save();
      this.ctx.translate(this.offsetX, this.offsetY);
      this.ctx.scale(this.scale, this.scale);
    }

    private restoreTransform(): void {
      this.ctx.restore();
    }
  }
  ```

- [ ] Add hit detection:
  ```typescript
  export class CanvasRenderer {
    hitTest(x: number, y: number): string | null {
      // Transform screen coordinates to canvas coordinates
      const canvasX = (x - this.offsetX) / this.scale;
      const canvasY = (y - this.offsetY) / this.scale;

      // Check each token
      for (const [tokenId, pos] of this.positions) {
        const token = this.getTokenById(tokenId);
        if (!token) continue;

        // Check if point is within token bounds
        if (canvasX >= pos.x - 20 && canvasX <= pos.x + 20 &&
            canvasY >= pos.y - 15 && canvasY <= pos.y + 15) {
          return tokenId;
        }
      }

      return null;
    }
  }
  ```

- [ ] Add animation support (`src/lib/rendering/animations.ts`):
  ```typescript
  // Learn: Animation utilities, easing functions
  export interface Animation {
    startTime: number;
    duration: number;
    update: (progress: number) => void;
  }

  export class AnimationManager {
    private animations: Animation[] = [];

    add(animation: Animation): void {
      this.animations.push(animation);
    }

    update(timestamp: number): void {
      this.animations = this.animations.filter(anim => {
        const elapsed = timestamp - anim.startTime;
        const progress = Math.min(elapsed / anim.duration, 1);

        anim.update(easeInOutCubic(progress));

        return progress < 1;
      });
    }
  }

  export function easeInOutCubic(t: number): number {
    return t < 0.5
      ? 4 * t * t * t
      : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }
  ```

- [ ] Test Canvas rendering:
  - Create test component with sample tokens
  - Test main path rendering with varying thickness
  - Test alternative connections as bezier curves
  - Test branch paths with colors
  - Test zoom and pan
  - Test hit detection

## Acceptance Criteria

- [ ] CanvasRenderer draws main path with varying thickness
- [ ] Alternative connections render as subtle bezier curves
- [ ] Branch paths render with distinct colors
- [ ] Token nodes are positioned correctly from layout
- [ ] Layering is correct (connections behind nodes)
- [ ] Zoom and pan work smoothly
- [ ] Hit detection correctly identifies clicked tokens
- [ ] Animations are smooth

## Tutorial Notes

**What you'll learn:**
- HTML5 Canvas API fundamentals
- Drawing primitives (lines, shapes, text)
- Canvas coordinate systems and transforms
- Bezier curves for smooth connections
- Hit detection in Canvas
- requestAnimationFrame for smooth animations
- Easing functions for natural motion
- Canvas lifecycle management

**Key Canvas concepts:**
- `getContext('2d')` gets the 2D rendering context
- `beginPath()`, `moveTo()`, `lineTo()`, `stroke()` draw lines
- `bezierCurveTo()` draws smooth curves
- `save()` and `restore()` manage state
- `translate()` and `scale()` apply transforms
- `clearRect()` clears the canvas

**Key concepts:**
- Layering: Draw background first, foreground last
- Hit detection: Transform screen coordinates to canvas coordinates
- Animations: Use requestAnimationFrame for smooth 60fps
- Easing: Make animations feel natural

**Resources:**
- [Canvas API Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [Canvas Coordinate Systems](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage)
- [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)

## Related Issues

- #4: Token node component
- #5: Layout algorithms
- #9: Visual polish

## Future Work

- Add glow effects on main path
- Add gradient colors for branches
- Add smooth layout transitions
- Add particle effects for token generation
- Optimize rendering for large trees