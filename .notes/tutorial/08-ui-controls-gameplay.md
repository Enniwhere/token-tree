# Step 8: UI Controls & Gameplay

**Learn:** Form bindings, search, scoring

## Concepts
- **Form bindings**: Two-way data binding for form inputs
- **Search algorithms**: Find substrings in token sequences
- **Scoring system**: Calculate scores based on path probability

## Actions
- [ ] Create `src/components/ParameterControls.svelte` with sliders for temperature, top-k, max_tokens
- [ ] Add reactive bindings with bind:value
- [ ] Create `src/components/GameplayControls.svelte` with generate, search, reset buttons
- [ ] Implement target substring search functionality
- [ ] Implement scoring system based on path probability
- [ ] Connect controls to game state and LLM backend
- [ ] Test parameter adjustments and gameplay controls

## Verify
- [ ] Parameter changes affect generation, search finds substrings, score updates

## Resources
- Svelte bindings: https://svelte.dev/docs#template-syntax