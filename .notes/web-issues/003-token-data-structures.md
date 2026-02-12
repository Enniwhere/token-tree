# Issue 3: Implement token data structures and game state

## Description

Define and implement the core data structures for tokens, branches, and game state. These structures will be used throughout the game for visualization, interaction, and scoring.

**Tutorial Focus**: This issue introduces Svelte 5's reactivity system in depth - `$state`, `$derived`, and `$effect` runes. You'll learn how to manage complex game state reactively and how derived values automatically update when dependencies change.

## Tasks

- [ ] Create token data types (`src/lib/llm/types.ts`):
  ```typescript
  // Learn: TypeScript types, interfaces
  export interface TokenData {
    id: string;
    text: string;
    probability: number;  // 0.0 to 1.0
    logprob: number;
    is_main_path: boolean;
    alternatives: TokenData[];
    position: number;  // Index in sequence
    parent_id: string | null;
    children_ids: string[];
    branch_id: string;
    cumulative_probability: number;
  }

  export interface BranchData {
    id: string;
    token_ids: string[];
    is_active: boolean;
    color: string;
    start_position: number;
  }
  ```

- [ ] Create game state store (`src/lib/game/state.ts`):
  ```typescript
  // Learn: Svelte stores, $state runes for reactive state
  import { writable, derived } from 'svelte/store';

  // Using Svelte 5 runes approach
  export class GameState {
    // Learn: $state creates reactive state
    tokens = $state<Map<string, TokenData>>(new Map());
    branches = $state<Map<string, BranchData>>(new Map());
    active_branch_ids = $state<string[]>([]);

    current_prompt = $state('');
    target_substring = $state('');
    parameters = $state({
      temperature: 0.7,
      top_k: 4,
      max_tokens: 50
    });

    score = $state(0);

    // Learn: $derived creates computed values that update automatically
    get main_path_tokens(): TokenData[] {
      return Array.from(this.tokens.values())
        .filter(t => t.is_main_path)
        .sort((a, b) => a.position - b.position);
    }

    get active_branches(): BranchData[] {
      return this.active_branch_ids
        .map(id => this.branches.get(id))
        .filter(Boolean) as BranchData[];
    }
  }
  ```

- [ ] Create state management utilities (`src/lib/game/state-manager.ts`):
  ```typescript
  // Learn: State manipulation methods
  export class GameStateManager {
    private state: GameState;

    constructor(state: GameState) {
      this.state = state;
    }

    addTokens(tokens: TokenData[]): void {
      tokens.forEach(token => {
        this.state.tokens.set(token.id, token);
      });
    }

    addBranch(branch: BranchData): void {
      this.state.branches.set(branch.id, branch);
      if (branch.is_active) {
        this.state.active_branch_ids = [...this.state.active_branch_ids, branch.id];
      }
    }

    removeBranch(branchId: string): void {
      const branch = this.state.branches.get(branchId);
      if (branch?.is_active) {
        this.state.active_branch_ids = this.state.active_branch_ids
          .filter(id => id !== branchId);
      }
      this.state.branches.delete(branchId);
    }

    getTokenAtPosition(position: number, branchId?: string): TokenData | undefined {
      // Find token at specific position in main path or branch
    }

    calculateBranchProbability(branchId: string): number {
      // Calculate cumulative probability for branch
    }

    findSubstringInTree(substring: string): MatchResult[] {
      // Search all tokens for substring
    }
  }
  ```

- [ ] Create utility functions (`src/lib/game/utils.ts`):
  ```typescript
  // Learn: Pure functions for calculations
  export function calculateCumulativeProbability(tokens: TokenData[]): number {
    return tokens.reduce((product, token) => product * token.probability, 1);
  }

  export function findCommonAncestor(
    token1: TokenData,
    token2: TokenData,
    tokens: Map<string, TokenData>
  ): TokenData | null {
    // Find common ancestor in tree
  }

  export function getBranchPath(
    branchId: string,
    branches: Map<string, BranchData>,
    tokens: Map<string, TokenData>
  ): TokenData[] {
    // Get all tokens in a branch
  }

  export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  ```

- [ ] Create branch color palette (`src/lib/game/colors.ts`):
  ```typescript
  export const BRANCH_COLORS = [
    '#e74c3c', // Red
    '#9b59b6', // Purple
    '#f39c12', // Orange
    '#27ae60', // Green
    '#3498db', // Blue
  ];

  export function getNextBranchColor(usedColors: string[]): string {
    const available = BRANCH_COLORS.filter(c => !usedColors.includes(c));
    return available[0] || BRANCH_COLORS[usedColors.length % BRANCH_COLORS.length];
  }
  ```

- [ ] Create game state component (`src/components/GameStateProvider.svelte`):
  ```svelte
  <script>
    // Learn: Context API for sharing state across components
    import { setContext } from 'svelte';
    import { GameState, GameStateManager } from '$lib/game/state';

    const gameState = new GameState();
    const stateManager = new GameStateManager(gameState);

    // Learn: Provide state to child components
    setContext('gameState', gameState);
    setContext('stateManager', stateManager);

    // Learn: $effect runs when dependencies change
    $effect(() => {
      console.log('Score changed:', gameState.score);
    });
  </script>

  <slot />
  ```

- [ ] Test state management:
  - Create test component that adds tokens and branches
  - Verify derived values update correctly
  - Test state persistence across component updates
  - Verify branch color assignment

## Acceptance Criteria

- [ ] TokenData interface properly represents tokens with all required fields
- [ ] BranchData interface tracks branches with color and state
- [ ] GameState class manages all game state reactively
- [ ] GameStateManager provides methods for state manipulation
- [ ] Derived values update automatically when dependencies change
- [ ] Utility functions work correctly for probability calculations
- [ ] Branch colors are assigned correctly
- [ ] GameStateProvider shares state with child components

## Tutorial Notes

**What you'll learn:**
- Svelte 5 `$state` rune for reactive state
- Svelte 5 `$derived` rune for computed values
- Svelte 5 `$effect` rune for side effects
- TypeScript interfaces and types
- State management patterns
- Context API for sharing state
- Pure functions for calculations

**Key Svelte 5 concepts:**
- `$state(variable)` creates reactive state - changes trigger UI updates
- `$derived(expression)` creates computed values - auto-updates when dependencies change
- `$effect(() => { ... })` runs code when dependencies change (like `useEffect` in React)
- State is local to component by default, use context for global state

**Key concepts:**
- Separation of state (data) from state management (operations)
- Derived values avoid manual recalculation
- Pure functions are easier to test and reason about
- Context API enables state sharing without prop drilling

**Resources:**
- [Svelte 5 Runes Documentation](https://svelte.dev/docs/runes)
- [Svelte Context API](https://svelte.dev/docs/svelte#setcontext)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

## Related Issues

- #1: Project structure
- #2: LLM abstraction
- #4: Token node component

## Future Work

- Add undo/redo functionality
- Implement branch history
- Add save/load game state to localStorage
- Add state persistence across page refreshes