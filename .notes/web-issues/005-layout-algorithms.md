# Issue 5: Implement pluggable layout algorithm system

## Description

Create a flexible system for tree layout algorithms that allows experimentation with different approaches. Implement at least two algorithms (simple tree layout and force-directed) to compare their effectiveness for token tree visualization.

**Tutorial Focus**: This issue introduces Canvas basics and coordinate systems. You'll learn how to position elements in 2D space, calculate positions algorithmically, and understand how layout algorithms work.

## Tasks

- [ ] Create layout algorithm interface (`src/lib/game/layout/algorithm.ts`):
  ```typescript
  // Learn: TypeScript interfaces, coordinate systems
  export interface Point {
    x: number;
    y: number;
  }

  export interface LayoutResult {
    positions: Map<string, Point>;  // token_id -> position
    connections: Connection[];
  }

  export interface Connection {
    from: string;  // token_id
    to: string;    // token_id
    type: 'main' | 'alternative' | 'branch';
    branchId?: string;
  }

  export interface LayoutAlgorithm {
    layout(tokens: TokenData[], branches: BranchData[]): LayoutResult;
    getName(): string;
    getDescription(): string;
  }
  ```

- [ ] Create SimpleTreeLayout implementation (`src/lib/game/layout/tree-layout.ts`):
  ```typescript
  // Learn: Simple positioning algorithms
  export class SimpleTreeLayout implements LayoutAlgorithm {
    private horizontalSpacing = 120;
    private verticalSpacing = 80;
    private baseY = 300;

    layout(tokens: TokenData[], branches: BranchData[]): LayoutResult {
      const positions = new Map<string, Point>();
      const connections: Connection[] = [];

      // Layout main path
      const mainPathTokens = tokens.filter(t => t.is_main_path);
      mainPathTokens.forEach((token, index) => {
        positions.set(token.id, {
          x: index * this.horizontalSpacing + 50,
          y: this.baseY
        });

        // Add main path connections
        if (index > 0) {
          connections.push({
            from: mainPathTokens[index - 1].id,
            to: token.id,
            type: 'main'
          });
        }
      });

      // Layout alternatives
      tokens.filter(t => !t.is_main_path).forEach(token => {
        const parent = tokens.find(t => t.id === token.parent_id);
        if (parent) {
          const parentPos = positions.get(parent.id)!;
          const offset = (token.position % 2 === 0 ? 1 : -1) *
            Math.ceil(token.position / 2) * this.verticalSpacing;

          positions.set(token.id, {
            x: parentPos.x,
            y: parentPos.y + offset
          });

          connections.push({
            from: parent.id,
            to: token.id,
            type: 'alternative'
          });
        }
      });

      return { positions, connections };
    }

    getName(): string {
      return 'Simple Tree';
    }

    getDescription(): string {
      return 'Horizontal tree with alternatives stacked above/below main path';
    }
  }
  ```

- [ ] Create ForceDirectedLayout implementation (`src/lib/game/layout/force-layout.ts`):
  ```typescript
  // Learn: Physics-based layout algorithms
  export class ForceDirectedLayout implements LayoutAlgorithm {
    private iterations = 100;
    private springStrength = 0.1;
    private repulsionStrength = 1000;
    private damping = 0.5;

    layout(tokens: TokenData[], branches: BranchData[]): LayoutResult {
      // Initialize positions
      const positions = this.initializePositions(tokens);

      // Run force-directed simulation
      for (let i = 0; i < this.iterations; i++) {
        this.applyForces(tokens, positions);
      }

      // Generate connections
      const connections = this.generateConnections(tokens, branches);

      return { positions, connections };
    }

    private initializePositions(tokens: TokenData[]): Map<string, Point> {
      // Start with simple tree layout as initial positions
      const simpleLayout = new SimpleTreeLayout();
      return simpleLayout.layout(tokens, []).positions;
    }

    private applyForces(tokens: TokenData[], positions: Map<string, Point>): void {
      // Learn: Force calculation, vector math
      const forces = new Map<string, Point>();

      // Initialize forces
      tokens.forEach(token => {
        forces.set(token.id, { x: 0, y: 0 });
      });

      // Apply repulsion (push tokens apart)
      for (let i = 0; i < tokens.length; i++) {
        for (let j = i + 1; j < tokens.length; j++) {
          const t1 = tokens[i];
          const t2 = tokens[j];
          const p1 = positions.get(t1.id)!;
          const p2 = positions.get(t2.id)!;

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy) || 1;

          const force = this.repulsionStrength / (distance * distance);
          const fx = (dx / distance) * force;
          const fy = (dy / distance) * force;

          forces.get(t1.id)!.x += fx;
          forces.get(t1.id)!.y += fy;
          forces.get(t2.id)!.x -= fx;
          forces.get(t2.id)!.y -= fy;
        }
      }

      // Apply spring forces (maintain connections)
      tokens.forEach(token => {
        if (token.parent_id) {
          const parent = tokens.find(t => t.id === token.parent_id);
          if (parent) {
            const p1 = positions.get(token.id)!;
            const p2 = positions.get(parent.id)!;

            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy) || 1;

            const targetDistance = 80;
            const force = (distance - targetDistance) * this.springStrength;
            const fx = (dx / distance) * force;
            const fy = (dy / distance) * force;

            forces.get(token.id)!.x -= fx;
            forces.get(token.id)!.y -= fy;
            forces.get(parent.id)!.x += fx;
            forces.get(parent.id)!.y += fy;
          }
        }
      });

      // Apply forces to positions with damping
      tokens.forEach(token => {
        const pos = positions.get(token.id)!;
        const force = forces.get(token.id)!;

        pos.x += force.x * this.damping;
        pos.y += force.y * this.damping;
      });
    }

    getName(): string {
      return 'Force Directed';
    }

    getDescription(): string {
      return 'Physics-based layout with spring and repulsion forces';
    }
  }
  ```

- [ ] Create LayoutManager class (`src/lib/game/layout/manager.ts`):
  ```typescript
  // Learn: Strategy pattern, algorithm switching
  export class LayoutManager {
    private algorithms: Map<string, LayoutAlgorithm> = new Map();
    private currentAlgorithm: LayoutAlgorithm;

    constructor() {
      this.registerAlgorithm(new SimpleTreeLayout());
      this.registerAlgorithm(new ForceDirectedLayout());
      this.currentAlgorithm = this.algorithms.get('Simple Tree')!;
    }

    registerAlgorithm(algorithm: LayoutAlgorithm): void {
      this.algorithms.set(algorithm.getName(), algorithm);
    }

    setAlgorithm(name: string): void {
      const algorithm = this.algorithms.get(name);
      if (algorithm) {
        this.currentAlgorithm = algorithm;
      }
    }

    getAvailableAlgorithms(): string[] {
      return Array.from(this.algorithms.keys());
    }

    layout(tokens: TokenData[], branches: BranchData[]): LayoutResult {
      return this.currentAlgorithm.layout(tokens, branches);
    }
  }
  ```

- [ ] Create layout configuration (`src/lib/game/layout/config.ts`):
  ```typescript
  export interface LayoutConfig {
    algorithm: string;
    horizontalSpacing: number;
    verticalSpacing: number;
    iterations: number;
    springStrength: number;
    repulsionStrength: number;
    damping: number;
  }

  export const DEFAULT_LAYOUT_CONFIG: LayoutConfig = {
    algorithm: 'Simple Tree',
    horizontalSpacing: 120,
    verticalSpacing: 80,
    iterations: 100,
    springStrength: 0.1,
    repulsionStrength: 1000,
    damping: 0.5,
  };
  ```

- [ ] Create LayoutSelector component (`src/components/LayoutSelector.svelte`):
  ```svelte
  <script>
    // Learn: Select dropdown, reactive config
    import { LayoutManager } from '$lib/game/layout/manager';

    let { layoutManager, config } = $props();

    function handleAlgorithmChange(event) {
      config.algorithm = event.target.value;
      layoutManager.setAlgorithm(config.algorithm);
    }
  </script>

  <div class="layout-selector">
    <label>
      Layout Algorithm:
      <select bind:value={config.algorithm}>
        {#each layoutManager.getAvailableAlgorithms() as algorithm}
          <option value={algorithm}>{algorithm}</option>
        {/each}
      </select>
    </label>
  </div>
  ```

- [ ] Test layout algorithms:
  - Create test component with sample tokens
  - Test SimpleTreeLayout produces predictable results
  - Test ForceDirectedLayout produces organic results
  - Test algorithm switching
  - Verify positions are calculated correctly

## Acceptance Criteria

- [ ] LayoutAlgorithm interface defines clear contract
- [ ] SimpleTreeLayout produces predictable horizontal tree
- [ ] ForceDirectedLayout produces organic tree structure
- [ ] LayoutManager can switch between algorithms
- [ ] LayoutSelector component allows algorithm selection
- [ ] Positions are calculated correctly for all tokens
- [ ] Connections are generated correctly
- [ ] Layout updates trigger re-rendering

## Tutorial Notes

**What you'll learn:**
- Canvas coordinate systems (x, y positioning)
- Layout algorithm design patterns
- Physics-based simulations (forces, damping)
- Vector math for 2D calculations
- Strategy pattern for algorithm selection
- TypeScript interfaces and implementations

**Key concepts:**
- Layout algorithms calculate positions for visual elements
- Simple layouts are predictable but less visually appealing
- Force-directed layouts are organic but less predictable
- Spring forces maintain connections
- Repulsion forces prevent overlap
- Damping stabilizes the simulation

**Key math concepts:**
- Distance formula: $\sqrt{dx^2 + dy^2}$
- Normalization: $(dx/distance, dy/distance)$
- Force application: $position += force \times damping$

**Resources:**
- [Canvas Coordinate Systems](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage)
- [Force-Directed Graph Drawing](https://en.wikipedia.org/wiki/Force-directed_graph_drawing)
- [Vector Math](https://www.mathsisfun.com/algebra/vectors.html)

## Related Issues

- #3: Token data structures
- #4: Token node component
- #6: Canvas rendering

## Future Work

- Add HierarchicalLayout algorithm
- Add RadialLayout algorithm
- Add layout animation (smooth transitions)
- Add layout parameter tuning UI
- Add layout presets