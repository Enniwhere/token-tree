# Issue 8: Implement UI controls and gameplay mechanics

## Description

Create UI controls for adjusting generation parameters and implement core gameplay mechanics including target substring search and scoring system.

**Tutorial Focus**: This issue introduces form handling in Svelte, reactive form bindings, and implementing game mechanics. You'll learn how to create interactive UI controls and implement search and scoring functionality.

## Tasks

- [ ] Create ParameterControls component (`src/components/ParameterControls.svelte`):
  ```svelte
  <script>
    // Learn: Form bindings, reactive inputs
    let { parameters } = $props();

    function handleApply() {
      // Dispatch event to update LLM backend
      dispatch('apply', { parameters });
    }
  </script>

  <div class="parameter-controls">
    <h3>Generation Parameters</h3>

    <label>
      Temperature: {parameters.temperature.toFixed(1)}
      <input
        type="range"
        min="0"
        max="2"
        step="0.1"
        bind:value={parameters.temperature}
      />
      <small>Controls randomness (0 = deterministic, 2 = very random)</small>
    </label>

    <label>
      Top-K: {parameters.top_k}
      <input
        type="range"
        min="1"
        max="10"
        step="1"
        bind:value={parameters.top_k}
      />
      <small>Number of alternative tokens to consider</small>
    </label>

    <label>
      Max Tokens: {parameters.max_tokens}
      <input
        type="range"
        min="1"
        max="200"
        step="10"
        bind:value={parameters.max_tokens}
      />
      <small>Maximum tokens to generate</small>
    </label>

    <button on:click={handleApply}>Apply</button>
  </div>

  <style>
    .parameter-controls label {
      display: block;
      margin: 12px 0;
    }

    .parameter-controls small {
      display: block;
      color: #666;
      font-size: 12px;
      margin-top: 4px;
    }
  </style>
  ```

- [ ] Create GameplayControls component (`src/components/GameplayControls.svelte`):
  ```svelte
  <script>
    // Learn: Game controls, event dispatching
    let { gameState, onGenerate, onSearch, onReset } = $props();

    let targetSubstring = $state('');

    function handleSearch() {
      onSearch?.(targetSubstring);
    }

    function handleGenerate() {
      onGenerate?.();
    }

    function handleReset() {
      onReset?.();
    }
  </script>

  <div class="gameplay-controls">
    <h3>Gameplay</h3>

    <div class="score-display">
      <span class="score-label">Score:</span>
      <span class="score-value">{gameState.score}</span>
    </div>

    <label>
      Target Substring:
      <input
        type="text"
        bind:value={targetSubstring}
        placeholder="e.g., 'hello world'"
      />
    </label>

    <button on:click={handleSearch}>Search</button>
    <button on:click={handleGenerate}>New Generation</button>
    <button on:click={handleReset}>Reset</button>
  </div>

  <style>
    .score-display {
      display: flex;
      justify-content: space-between;
      padding: 8px;
      background: #f5f5f5;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .score-value {
      font-weight: bold;
      font-size: 18px;
      color: var(--color-main-path);
    }
  </style>
  ```

- [ ] Implement target substring search (`src/lib/game/search.ts`):
  ```typescript
  // Learn: Search algorithms, string matching
  export interface MatchResult {
    tokenId: string;
    text: string;
    position: number;
    branchId: string;
    cumulativeProbability: number;
    context: string;
  }

  export function findSubstringInTree(
    substring: string,
    tokens: Map<string, TokenData>,
    branches: Map<string, BranchData>
  ): MatchResult[] {
    const matches: MatchResult[] = [];
    const searchLower = substring.toLowerCase();

    tokens.forEach((token, tokenId) => {
      if (token.text.toLowerCase().includes(searchLower)) {
        const context = getContext(tokenId, tokens);
        matches.push({
          tokenId,
          text: token.text,
          position: token.position,
          branchId: token.branch_id,
          cumulativeProbability: token.cumulative_probability,
          context,
        });
      }
    });

    return matches.sort((a, b) => b.cumulative_probability - a.cumulative_probability);
  }

  function getContext(
    tokenId: string,
    tokens: Map<string, TokenData>,
    windowSize: number = 3
  ): string {
    const token = tokens.get(tokenId);
    if (!token) return '';

    const allTokens = Array.from(tokens.values())
      .sort((a, b) => a.position - b.position);

    const index = allTokens.findIndex(t => t.id === tokenId);
    const start = Math.max(0, index - windowSize);
    const end = Math.min(allTokens.length, index + windowSize + 1);

    return allTokens.slice(start, end).map(t => t.text).join(' ');
  }
  ```

- [ ] Create SearchResults component (`src/components/SearchResults.svelte`):
  ```svelte
  <script>
    // Learn: Displaying search results, navigation
    let { matches, onSelectMatch } = $props();

    function handleMatchClick(match: MatchResult) {
      onSelectMatch?.(match);
    }
  </script>

  <div class="search-results">
    <h3>Search Results ({matches.length})</h3>

    {#if matches.length === 0}
      <p class="no-results">No matches found</p>
    {:else}
      <div class="matches-list">
        {#each matches as match (match.tokenId)}
          <div
            class="match-item"
            on:click={() => handleMatchClick(match)}
            role="button"
            tabindex="0"
          >
            <div class="match-text">
              <strong>"{match.text}"</strong>
            </div>
            <div class="match-context">...{match.context}...</div>
            <div class="match-info">
              <span>Position: {match.position}</span>
              <span>Probability: {(match.cumulative_probability * 100).toFixed(1)}%</span>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>

  <style>
    .match-item {
      padding: 8px;
      margin: 4px 0;
      background: #f9f9f9;
      border-radius: 4px;
      cursor: pointer;
      transition: background 0.2s;
    }

    .match-item:hover {
      background: #e8f4f8;
    }

    .match-context {
      color: #666;
      font-size: 14px;
      margin: 4px 0;
    }

    .match-info {
      display: flex;
      gap: 12px;
      font-size: 12px;
      color: #999;
    }
  </style>
  ```

- [ ] Implement scoring system (`src/lib/game/scoring.ts`):
  ```typescript
  // Learn: Scoring algorithms, score calculation
  export function calculateScore(
    match: MatchResult,
    branchProbability: number,
    branchLength: number
  ): number {
    const baseScore = 100;
    const probabilityMultiplier = Math.max(0.1, branchProbability * 10);
    const lengthMultiplier = 1 + (branchLength * 0.1);

    return Math.round(baseScore * probabilityMultiplier * lengthMultiplier);
  }

  export function calculateTotalScore(
    matches: MatchResult[],
    branches: Map<string, BranchData>,
    tokens: Map<string, TokenData>
  ): number {
    let totalScore = 0;

    matches.forEach(match => {
      const branch = branches.get(match.branchId);
      if (branch) {
        const branchTokens = branch.token_ids
          .map(id => tokens.get(id))
          .filter(Boolean) as TokenData[];

        const branchProbability = calculateCumulativeProbability(branchTokens);
        const score = calculateScore(match, branchProbability, branchTokens.length);
        totalScore += score;
      }
    });

    return totalScore;
  }

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
  ```

- [ ] Add visual feedback for scoring (`src/components/ScoreAnimation.svelte`):
  ```svelte
  <script>
    // Learn: Score animations, visual feedback
    import { fade, fly } from 'svelte/transition';

    let { score, x, y } = $props();
    let visible = $state(true);

    setTimeout(() => {
      visible = false;
    }, 2000);
  </script>

  {#if visible}
    <div
      class="score-animation"
      style="left: {x}px; top: {y}px;"
      transition:fly|local={{ y: -50, duration: 2000 }}
    >
      +{score}
    </div>
  {/if}

  <style>
    .score-animation {
      position: absolute;
      font-size: 24px;
      font-weight: bold;
      color: #27ae60;
      pointer-events: none;
      text-shadow: 0 0 10px rgba(39, 174, 96, 0.5);
    }
  </style>
  ```

- [ ] Add keyboard shortcuts (`src/lib/game/shortcuts.ts`):
  ```typescript
  // Learn: Keyboard event handling
  export interface ShortcutConfig {
    key: string;
    ctrl?: boolean;
    shift?: boolean;
    alt?: boolean;
    action: () => void;
    description: string;
  }

  export class ShortcutManager {
    private shortcuts: ShortcutConfig[] = [];

    register(shortcut: ShortcutConfig): void {
      this.shortcuts.push(shortcut);
    }

    handle(event: KeyboardEvent): boolean {
      for (const shortcut of this.shortcuts) {
        if (this.matches(event, shortcut)) {
          event.preventDefault();
          shortcut.action();
          return true;
        }
      }
      return false;
    }

    private matches(event: KeyboardEvent, shortcut: ShortcutConfig): boolean {
      return (
        event.key.toLowerCase() === shortcut.key.toLowerCase() &&
        !!event.ctrlKey === !!shortcut.ctrl &&
        !!event.shiftKey === !!shortcut.shift &&
        !!event.altKey === !!shortcut.alt
      );
    }
  }
  ```

- [ ] Create ShortcutsHelp component (`src/components/ShortcutsHelp.svelte`):
  ```svelte
  <script>
    let { shortcuts } = $props();

    function formatShortcut(shortcut: ShortcutConfig): string {
      const parts = [];
      if (shortcut.ctrl) parts.push('Ctrl');
      if (shortcut.shift) parts.push('Shift');
      if (shortcut.alt) parts.push('Alt');
      parts.push(shortcut.key.toUpperCase());
      return parts.join(' + ');
    }
  </script>

  <div class="shortcuts-help">
    <h4>Keyboard Shortcuts</h4>
    <ul>
      {#each shortcuts as shortcut}
        <li>
          <kbd>{formatShortcut(shortcut)}</kbd>
          <span>{shortcut.description}</span>
        </li>
      {/each}
    </ul>
  </div>

  <style>
    kbd {
      background: #f5f5f5;
      border: 1px solid #ddd;
      border-radius: 3px;
      padding: 2px 6px;
      font-family: monospace;
      font-size: 12px;
    }

    li {
      display: flex;
      justify-content: space-between;
      padding: 4px 0;
    }
  </style>
  ```

- [ ] Test UI controls and gameplay:
  - Test parameter sliders update correctly
  - Test target substring search finds matches
  - Test search results display correctly
  - Test scoring calculates correctly
  - Test score animations display
  - Test keyboard shortcuts work

## Acceptance Criteria

- [ ] Parameter sliders work and update values
- [ ] Target substring search finds all occurrences
- [ ] Search results display with context
- [ ] Clicking search result navigates to token
- [ ] Scoring system calculates scores correctly
- [ ] Score updates with visual feedback
- [ ] Keyboard shortcuts work
- [ ] Shortcuts help displays correctly

## Tutorial Notes

**What you'll learn:**
- Form handling in Svelte
- Reactive bindings with `bind:value`
- Event dispatching with `createEventDispatcher`
- Search algorithms and string matching
- Scoring algorithms
- Keyboard event handling
- Animations with Svelte transitions

**Key Svelte concepts:**
- `bind:value` creates two-way binding for form inputs
- `on:click` handles click events
- `transition:name` applies animations
- `$state` creates reactive state

**Key concepts:**
- Search should be case-insensitive
- Context helps users understand matches
- Scoring rewards both probability and length
- Keyboard shortcuts improve power user experience
- Visual feedback makes scoring satisfying

**Resources:**
- [Svelte Bindings](https://svelte.dev/docs/template-syntax-element-directives#bind)
- [Svelte Transitions](https://svelte.dev/docs/svelte-transition)
- [Keyboard Events](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent)

## Related Issues

- #3: Token data structures
- #7: Branch continuation
- #9: Visual polish

## Future Work

- Add score history and statistics
- Add high score tracking
- Add score sharing
- Add difficulty levels
- Add time-based scoring