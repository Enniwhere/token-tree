# Issue 7: Implement branch continuation logic

## Description

Implement logic for continuing branches when players click on alternative tokens. This involves making additional LLM API calls to generate continuation tokens for selected branch.

**Tutorial Focus**: This issue introduces async operations in Svelte, Web Workers for offloading computation, and managing complex async workflows. You'll learn how to handle loading states, errors, and progress updates during async operations.

## Tasks

- [ ] Extend LLMBackend interface (`src/lib/llm/backend.ts`):
  ```typescript
  export interface LLMBackend {
    // Existing methods...
    continueGeneration(
      basePrompt: string,
      branchTokens: string[],
      params: GenerationParams
    ): Promise<TokenData[]>;
  }
  ```

- [ ] Implement `continueGeneration()` in WebLLMBackend:
  ```typescript
  async continueGeneration(
    basePrompt: string,
    branchTokens: string[],
    params: GenerationParams
  ): Promise<TokenData[]> {
    // Learn: Construct prompt from base + branch tokens
    const fullPrompt = basePrompt + branchTokens.join('');

    const response = await this.engine.chat.completions.create({
      messages: [{ role: "user", content: fullPrompt }],
      temperature: params.temperature,
      max_tokens: params.max_tokens,
      logprobs: true,
      top_logprobs: params.top_logprobs || 4,
    });

    return this.parseResponse(response);
  }
  ```

- [ ] Create BranchManager class (`src/lib/game/branch-manager.ts`):
  ```typescript
  // Learn: Branch management, state updates
  export class BranchManager {
    private maxBranches = 5;
    private branchColors = BRANCH_COLORS;

    constructor(
      private gameState: GameState,
      private stateManager: GameStateManager
    ) {}

    canCreateBranch(): boolean {
      return this.gameState.active_branch_ids.length < this.maxBranches;
    }

    createBranch(
      startToken: TokenData,
      alternativeToken: TokenData
    ): BranchData {
      // Learn: Create new branch with unique ID
      const branchId = generateId();
      const usedColors = this.gameState.active_branches.map(b => b.color);
      const color = getNextBranchColor(usedColors);

      const branch: BranchData = {
        id: branchId,
        token_ids: [alternativeToken.id],
        is_active: true,
        color: color,
        start_position: startToken.position,
      };

      this.stateManager.addBranch(branch);
      return branch;
    }

    async continueBranch(
      branch: BranchData,
      numTokens: number = 10
    ): Promise<void> {
      // Learn: Async branch continuation
      const branchTokens = this.getBranchTokens(branch);

      // Get continuation from LLM
      const continuationTokens = await this.llmBackend.continueGeneration(
        this.gameState.current_prompt,
        branchTokens.map(t => t.text),
        this.gameState.parameters
      );

      // Add tokens to branch
      continuationTokens.forEach(token => {
        token.branch_id = branch.id;
        this.stateManager.addToken(token);
        branch.token_ids.push(token.id);
      });
    }

    removeBranch(branchId: string): void {
      this.stateManager.removeBranch(branchId);
    }

    private getBranchTokens(branch: BranchData): TokenData[] {
      return branch.token_ids
        .map(id => this.gameState.tokens.get(id))
        .filter(Boolean) as TokenData[];
    }
  }
  ```

- [ ] Create BranchPanel component (`src/components/BranchPanel.svelte`):
  ```svelte
  <script>
    // Learn: Async operations in Svelte, loading states
    import { BranchManager } from '$lib/game/branch-manager';

    let { gameState, branchManager } = $props();

    let continuingBranch = $state<string | null>(null);

    async function handleContinue(branchId: string) {
      continuingBranch = branchId;

      try {
        const branch = gameState.branches.get(branchId);
        if (branch) {
          await branchManager.continueBranch(branch);
        }
      } catch (error) {
        console.error('Failed to continue branch:', error);
      } finally {
        continuingBranch = null;
      }
    }

    function handleRemove(branchId: string) {
      branchManager.removeBranch(branchId);
    }
  </script>

  <div class="branch-panel">
    <h3>Active Branches</h3>

    {#each gameState.active_branches as branch (branch.id)}
      <div class="branch-item" style="border-left: 3px solid {branch.color}">
        <span class="branch-name">Branch {branch.id.slice(-4)}</span>
        <span class="branch-tokens">{branch.token_ids.length} tokens</span>

        <div class="branch-actions">
          {#if continuingBranch === branch.id}
            <span class="loading">Continuing...</span>
          {:else}
            <button on:click={() => handleContinue(branch.id)}>
              Continue
            </button>
            <button on:click={() => handleRemove(branch.id)}>
              Remove
            </button>
          {/if}
        </div>
      </div>
    {/each}

    {#if !branchManager.canCreateBranch()}
      <p class="warning">Maximum branches reached</p>
    {/if}
  </div>

  <style>
    .branch-item {
      padding: 8px;
      margin: 4px 0;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .loading {
      color: #666;
      font-style: italic;
    }

    .warning {
      color: #e74c3c;
      font-size: 14px;
    }
  </style>
  ```

- [ ] Implement branch creation flow in TokenNode:
  ```svelte
  <script>
    // Learn: Branch creation on click
    import { BranchManager } from '$lib/game/branch-manager';

    let { token, branchManager } = $props();

    async function handleClick() {
      if (!token.is_main_path && branchManager.canCreateBranch()) {
        // Find parent token
        const parentToken = getParentToken(token);

        // Create new branch
        const branch = branchManager.createBranch(parentToken, token);

        // Trigger continuation
        await branchManager.continueBranch(branch);
      }
    }
  </script>
  ```

- [ ] Add branch scoring (`src/lib/game/scoring.ts`):
  ```typescript
  // Learn: Scoring algorithms
  export function calculateBranchScore(
    branch: BranchData,
    tokens: Map<string, TokenData>
  ): number {
    const branchTokens = branch.token_ids
      .map(id => tokens.get(id))
      .filter(Boolean) as TokenData[];

    const cumulativeProbability = calculateCumulativeProbability(branchTokens);
    const lengthMultiplier = 1 + (branchTokens.length * 0.1);

    return Math.round(100 * cumulativeProbability * lengthMultiplier);
  }

  export function calculateMatchScore(
    match: MatchResult,
    branchProbability: number,
    branchLength: number
  ): number {
    const baseScore = 100;
    const probabilityMultiplier = branchProbability * 10;
    const lengthMultiplier = 1 + (branchLength * 0.1);

    return Math.round(baseScore * probabilityMultiplier * lengthMultiplier);
  }
  ```

- [ ] Handle edge cases:
  - Max branches reached (show warning)
  - Branch continuation fails (show error)
  - Duplicate branch creation (prevent or merge)
  - Branch with no continuations (allow deletion)

- [ ] Test branch continuation:
  - Create test component with sample tokens
  - Test clicking alternative creates branch
  - Test branch continuation generates tokens
  - Test branch removal
  - Test max branches limit
  - Test error handling

## Acceptance Criteria

- [ ] Clicking alternative token creates new branch
- [ ] Branch continuation generates tokens from LLM
- [ ] Branches have distinct colors
- [ ] BranchPanel shows active branches
- [ ] Branches can be removed
- [ ] Branch continuation can be triggered manually
- [ ] Max branches limit is enforced
- [ ] Errors are handled gracefully
- [ ] Loading states show during continuation

## Tutorial Notes

**What you'll learn:**
- Async operations in Svelte components
- Loading states and error handling
- Managing complex async workflows
- Branch management patterns
- Scoring algorithms
- State updates during async operations

**Key concepts:**
- Async operations need loading states
- Error handling is critical for user experience
- Branch IDs should be unique and persistent
- Branch colors should be visually distinct
- Scoring rewards both probability and length

**Key Svelte patterns:**
- Use `$state` for loading indicators
- Try/catch/finally for error handling
- Conditional rendering for loading states

**Resources:**
- [Svelte Async Patterns](https://learn.svelte.dev/tutorial/await-blocks)
- [Async/Await](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- [Error Handling](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Control_flow_and_error_handling)

## Related Issues

- #2: LLM abstraction
- #3: Token data structures
- #4: Token node component
- #8: UI controls and gameplay

## Future Work

- Add Web Worker for LLM generation to keep UI responsive
- Add branch history and undo/redo
- Add branch comparison view
- Add branch merging
- Cache continuations to reduce API calls