# Issue 9: Implement visual polish and animations

## Description

Add visual polish to the game including smooth animations, hover effects, transitions, and overall aesthetic improvements. This makes the game feel more polished and enjoyable to use.

**Tutorial Focus**: This issue introduces advanced CSS animations, Svelte transitions, and visual design principles. You'll learn how to add "juice" to your game with subtle animations and visual feedback.

## Tasks

- [ ] Add smooth transitions to TokenNode:
  ```svelte
  <script>
    import { scale, fade, fly } from 'svelte/transition';
    import { elasticOut } from 'svelte/easing';

    let { token } = $props();
  </script>

  <div
    class="token-node"
    transition:scale|local={{ duration: 200, easing: elasticOut }}
    in:fade|local={{ duration: 150 }}
    out:fly|local={{ y: 20, duration: 150 }}
  >
    <!-- Token content -->
  </div>
  ```

- [ ] Add hover effects with CSS:
  ```css
  .token-node {
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    transform: scale(1);
  }

  .token-node:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }

  .token-node:active {
    transform: scale(0.98);
  }
  ```

- [ ] Add glow effects to main path:
  ```typescript
  // Learn: Canvas glow effects
  private drawMainPath(): void {
    // Draw glow
    this.ctx.shadowColor = '#4a90e2';
    this.ctx.shadowBlur = 20;
    this.ctx.shadowOffsetX = 0;
    this.ctx.shadowOffsetY = 0;

    // Draw path
    // ...

    // Reset shadow
    this.ctx.shadowBlur = 0;
  }
  ```

- [ ] Add gradient colors for branches:
  ```typescript
  private drawBranchPaths(): void {
    const branchConnections = this.connections.filter(c => c.type === 'branch');

    branchConnections.forEach(conn => {
      const from = this.positions.get(conn.from)!;
      const to = this.positions.get(conn.to)!;

      // Learn: Create gradient
      const gradient = this.ctx.createLinearGradient(from.x, from.y, to.x, to.y);
      const color = this.getBranchColor(conn.branchId!);
      gradient.addColorStop(0, color);
      gradient.addColorStop(1, this.adjustBrightness(color, -20));

      this.ctx.strokeStyle = gradient;
      // Draw path
    });
  }

  private adjustBrightness(color: string, amount: number): string {
    // Learn: Color manipulation
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }
  ```

- [ ] Add particle effects for token generation:
  ```typescript
  // Learn: Particle system
  export class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    color: string;

    constructor(x: number, y: number, color: string) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 4;
      this.vy = (Math.random() - 0.5) * 4;
      this.life = 1;
      this.maxLife = 1;
      this.color = color;
    }

    update(): boolean {
      this.x += this.vx;
      this.y += this.vy;
      this.life -= 0.02;
      return this.life > 0;
    }

    draw(ctx: CanvasRenderingContext2D): void {
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  export class ParticleSystem {
    private particles: Particle[] = [];

    emit(x: number, y: number, color: string, count: number = 10): void {
      for (let i = 0; i < count; i++) {
        this.particles.push(new Particle(x, y, color));
      }
    }

    update(): void {
      this.particles = this.particles.filter(p => p.update());
    }

    draw(ctx: CanvasRenderingContext2D): void {
      this.particles.forEach(p => p.draw(ctx));
    }
  }
  ```

- [ ] Add smooth layout transitions:
  ```typescript
  // Learn: Animated layout transitions
  export class LayoutAnimator {
    private currentPositions: Map<string, Point> = new Map();
    private targetPositions: Map<string, Point> = new Map();
    private animationProgress = 0;
    private isAnimating = false;

    setTargetPositions(positions: Map<string, Point>): void {
      this.targetPositions = positions;
      this.animationProgress = 0;
      this.isAnimating = true;
    }

    update(): boolean {
      if (!this.isAnimating) return false;

      this.animationProgress += 0.05;

      if (this.animationProgress >= 1) {
        this.animationProgress = 1;
        this.isAnimating = false;
      }

      // Interpolate positions
      this.targetPositions.forEach((target, tokenId) => {
        const current = this.currentPositions.get(tokenId);
        if (current) {
          const t = easeInOutCubic(this.animationProgress);
          current.x = current.x + (target.x - current.x) * t;
          current.y = current.y + (target.y - current.y) * t;
        }
      });

      return this.isAnimating;
    }

    getCurrentPositions(): Map<string, Point> {
      return this.currentPositions;
    }
  }
  ```

- [ ] Add loading animations:
  ```svelte
  <script>
    // Learn: Loading spinners, progress bars
    let { progress, status } = $props();
  </script>

  <div class="loading-container">
    <div class="spinner"></div>
    <p class="status">{status}</p>
    <div class="progress-bar">
      <div class="progress-fill" style="width: {progress * 100}%"></div>
    </div>
  </div>

  <style>
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--color-main-path);
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .progress-bar {
      width: 100%;
      height: 4px;
      background: #f3f3f3;
      border-radius: 2px;
      overflow: hidden;
      margin-top: 12px;
    }

    .progress-fill {
      height: 100%;
      background: var(--color-main-path);
      transition: width 0.3s ease;
    }
  </style>
  ```

- [ ] Add toast notifications:
  ```svelte
  <script>
    // Learn: Toast notifications
    import { fade, fly } from 'svelte/transition';

    let toasts = $state([]);

    function showToast(message: string, type: 'success' | 'error' | 'info' = 'info') {
      const id = Date.now();
      toasts = [...toasts, { id, message, type }];

      setTimeout(() => {
        toasts = toasts.filter(t => t.id !== id);
      }, 3000);
    }
  </script>

  <div class="toast-container">
    {#each toasts as toast (toast.id)}
      <div
        class="toast {toast.type}"
        transition:fly|local={{ y: -50, duration: 300 }}
        in:fade|local={{ duration: 200 }}
      >
        {toast.message}
      </div>
    {/each}
  </div>

  <style>
    .toast {
      padding: 12px 16px;
      border-radius: 4px;
      margin: 8px 0;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    .toast.success {
      background: #d4edda;
      color: #155724;
      border-left: 4px solid #28a745;
    }

    .toast.error {
      background: #f8d7da;
      color: #721c24;
      border-left: 4px solid #dc3545;
    }

    .toast.info {
      background: #d1ecf1;
      color: #0c5460;
      border-left: 4px solid #17a2b8;
    }
  </style>
  ```

- [ ] Add responsive design:
  ```css
  /* Learn: Responsive design */
  .container {
    display: grid;
    grid-template-columns: 300px 1fr;
    height: 100vh;
  }

  @media (max-width: 768px) {
    .container {
      grid-template-columns: 1fr;
      grid-template-rows: auto 1fr;
    }

    .controls {
      max-height: 300px;
      overflow-y: auto;
    }
  }
  ```

- [ ] Add dark mode support:
  ```css
  /* Learn: CSS custom properties for theming */
  :root {
    --bg-primary: #ffffff;
    --bg-secondary: #f5f5f5;
    --text-primary: #2c3e50;
    --text-secondary: #7f8c8d;
    --border-color: #e0e0e0;
  }

  @media (prefers-color-scheme: dark) {
    :root {
      --bg-primary: #1a1a1a;
      --bg-secondary: #2d2d2d;
      --text-primary: #ecf0f1;
      --text-secondary: #bdc3c7;
      --border-color: #404040;
    }
  }

  body {
    background: var(--bg-primary);
    color: var(--text-primary);
  }
  ```

- [ ] Test visual polish:
  - Test animations are smooth
  - Test hover effects work
  - Test particle effects display
  - Test layout transitions
  - Test loading animations
  - Test toast notifications
  - Test responsive design
  - Test dark mode

## Acceptance Criteria

- [ ] Token nodes have smooth hover effects
- [ ] Main path has subtle glow effect
- [ ] Branch paths have gradient colors
- [ ] Particle effects display on token generation
- [ ] Layout transitions are smooth
- [ ] Loading animations display correctly
- [ ] Toast notifications work
- [ ] Design is responsive on mobile
- [ ] Dark mode works correctly

## Tutorial Notes

**What you'll learn:**
- CSS animations and transitions
- Svelte transitions (`scale`, `fade`, `fly`)
- Canvas effects (glow, gradients)
- Particle systems
- Layout animation
- Loading states
- Toast notifications
- Responsive design
- Dark mode with CSS custom properties

**Key concepts:**
- Animations should be subtle, not distracting
- Hover effects indicate interactivity
- Transitions make state changes feel natural
- Particles add "juice" to interactions
- Responsive design ensures mobile compatibility
- Dark mode respects user preferences

**Key CSS concepts:**
- `transition` for smooth state changes
- `@keyframes` for custom animations
- `@media` for responsive design
- `prefers-color-scheme` for dark mode
- CSS custom properties for theming

**Resources:**
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)
- [CSS Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Animations)
- [Svelte Transitions](https://svelte.dev/docs/svelte-transition)
- [Responsive Design](https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design)

## Related Issues

- #4: Token node component
- #6: Canvas rendering
- #8: UI controls and gameplay

## Future Work

- Add sound effects
- Add haptic feedback (mobile)
- Add more particle effects
- Add theme customization
- Add accessibility improvements