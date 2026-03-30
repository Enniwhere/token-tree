# Step 3: Game State Data Structures

**Learn:** $derived, $effect, state management

## Concepts
- **$derived**: Computed values that update automatically when dependencies change
- **$effect**: Run side effects when reactive values change
- **State management**: Centralized game state with reactive updates

## Actions
- [X] Create `src/lib/llm/types.ts` with TokenNode interface
- [X] Create `src/lib/game/state.ts` with GameState class using $state and $derived runes
- [X] Create `src/lib/game/state-manager.ts` with methods for adding/removing tokens and branches
- [X] Integrate GameState into App.svelte
- [X] Test reactive updates by changing state values

## Verify
- [X] State changes trigger UI updates automatically

## Resources
- Svelte stores: https://svelte.dev/docs#runes
- Reactivity: https://svelte.dev/docs/runes