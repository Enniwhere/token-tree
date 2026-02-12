# Step 3: Token Data Structures

**Learn:** $derived, $effect, state management

## Concepts
- **$derived**: Computed values that update automatically when dependencies change
- **$effect**: Run side effects when reactive values change
- **State management**: Centralized game state with reactive updates

## Actions
- [ ] Create `src/lib/llm/types.ts` with TokenData and BranchData interfaces
- [ ] Create `src/lib/game/state.ts` with GameState class using $state and $derived runes
- [ ] Create `src/lib/game/state-manager.ts` with methods for adding/removing tokens and branches
- [ ] Integrate GameState into App.svelte
- [ ] Test reactive updates by changing state values

## Verify
- [ ] State changes trigger UI updates automatically

## Resources
- Svelte stores: https://svelte.dev/docs#runes
- Reactivity: https://svelte.dev/docs/runes