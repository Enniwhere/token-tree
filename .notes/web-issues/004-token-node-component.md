# Issue 4: Create TokenNode component with interactivity

## Description

Create a reusable TokenNode component that displays individual tokens with click detection and hover states. This is the fundamental building block for the token tree visualization.

**Tutorial Focus**: This issue introduces Svelte event handling, conditional rendering, and CSS transitions. You'll learn how to make interactive components that respond to user input with visual feedback.

## Tasks

- [ ] Create TokenNode component (`src/components/TokenNode.svelte`):
  ```svelte
  <script>
    // Learn: Props, event handling, reactive classes
    let { token, isAlternative = false, onClick } = $props();

    let isHovered = $state(false);
    let isSelected = $state(false);

    function handleClick() {
      isSelected = !isSelected;
      onClick?.(token);
    }

    function handleMouseEnter() {
      isHovered = true;
    }

    function handleMouseLeave() {
      isHovered = false;
    }
  </script>

  <!-- Learn: Conditional classes, event handlers -->
  <div
    class="token-node"
    class:main-path={!isAlternative}
    class:alternative={isAlternative}
    class:hovered={isHovered}
    class:selected={isSelected}
    on:click={handleClick}
    on:mouseenter={handleMouseEnter}
    on:mouseleave={handleMouseLeave}
  >
    <span class="token-text">{token.text}</span>
    <span class="probability">{Math.round(token.probability * 100)}%</span>
  </div>

  <style>
    .token-node {
      padding: var(--spacing-token);
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .main-path {
      font-size: var(--font-main);
      color: var(--color-main-path);
    }

    .alternative {
      font-size: var(--font-alternative);
      color: var(--color-alternative);
    }

    .hovered {
      background-color: #e8f4f8;
      color: var(--color-main-path);
    }

    .selected {
      border: 2px solid var(--color-main-path);
    }

    .probability {
      font-size: 12px;
      opacity: 0.7;
    }
  </style>
  ```

- [ ] Add probability visualization:
  ```svelte
  <div class="probability-bar">
    <div class="probability-fill" style="width: {token.probability * 100}%"></div>
  </div>

  <style>
    .probability-bar {
      height: 3px;
      background-color: #eee;
      border-radius: 2px;
      overflow: hidden;
    }

    .probability-fill {
      height: 100%;
      background-color: var(--color-main-path);
      transition: width 0.3s ease;
    }
  </style>
  ```

- [ ] Create TokenNodeList component (`src/components/TokenNodeList.svelte`):
  ```svelte
  <script>
    // Learn: Iterating over arrays, slot composition
    import TokenNode from './TokenNode.svelte';

    let { tokens, isAlternative = false } = $props();

    function handleTokenClick(token) {
      // Dispatch event to parent
      dispatch('tokenClick', { token });
    }
  </script>

  <div class="token-list">
    {#each tokens as token (token.id)}
      <TokenNode
        {token}
        {isAlternative}
        onClick={(t) => handleTokenClick(t)}
      />
    {/each}
  </div>
  ```

- [ ] Add animation support:
  ```svelte
  <script>
    import { fade, scale } from 'svelte/transition';

    // Learn: Svelte transitions
  </script>

  <div transition:fade|local>
    <TokenNode {token} />
  </div>
  ```

- [ ] Create TokenNodePool utility (`src/lib/rendering/token-pool.ts`):
  ```typescript
  // Learn: Object pooling for performance
  export class TokenNodePool {
    private pool: Map<string, TokenNode> = new Map();

    get(tokenId: string): TokenNode | undefined {
      return this.pool.get(tokenId);
    }

    set(tokenId: string, node: TokenNode): void {
      this.pool.set(tokenId, node);
    }

    release(tokenId: string): void {
      // Mark node as available for reuse
    }

    clear(): void {
      this.pool.clear();
    }
  }
  ```

- [ ] Test TokenNode component:
  - Create test component with sample tokens
  - Test hover states and visual feedback
  - Test click events and selection
  - Test probability bar rendering
  - Test animations

## Acceptance Criteria

- [ ] TokenNode component displays token text correctly
- [ ] Main path and alternative tokens have distinct visual styles
- [ ] Hover state works with visual feedback
- [ ] Click events are emitted correctly
- [ ] Probability indicator displays correctly
- [ ] Animations are smooth and not distracting
- [ ] TokenNodeList renders multiple tokens efficiently
- [ ] TokenNodePool manages node instances

## Tutorial Notes

**What you'll learn:**
- Svelte props with `$props()`
- Event handling with `on:eventname`
- Conditional classes with `class:name={condition}`
- CSS transitions and animations
- Svelte transitions (`fade`, `scale`)
- Iterating over arrays with `{#each}`
- Event dispatching with `createEventDispatcher`
- Object pooling for performance

**Key Svelte concepts:**
- Props define component inputs
- Events flow up, props flow down
- `class:` directive for conditional classes
- Transitions are declarative - just add `transition:name`
- `{#each}` with `(key)` enables efficient list updates

**Key concepts:**
- Interactive components need clear visual feedback
- Hover states indicate interactivity
- Selection states show current choice
- Probability visualization helps decision-making
- Object pooling reduces memory allocation

**Resources:**
- [Svelte Event Handling](https://svelte.dev/docs/element-directives#on-eventname)
- [Svelte Transitions](https://svelte.dev/docs/svelte-transition)
- [CSS Transitions](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Transitions)

## Related Issues

- #1: Project structure
- #3: Token data structures
- #5: Layout algorithms

## Future Work

- Add keyboard navigation
- Add accessibility attributes (ARIA)
- Add drag-and-drop for branch reordering
- Add context menu for token actions