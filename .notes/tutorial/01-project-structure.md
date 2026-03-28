# Step 1: Project Structure

**Learn:** Svelte components, Vite, $state runes

## Concepts
- **Svelte component**: Reusable UI building block with markup, styles, and logic
- **Vite**: Fast build tool with dev server and hot reload
- **$state runes**: Svelte 5 reactive state management

## Actions
- [X] Create Svelte project: `npm create vite@latest token-tree-web -- --template svelte`
- [X] Install dependencies: `cd token-tree-web && npm install`
- [X] Create folder structure: `src/lib/llm/`, `src/lib/game/`, `src/lib/rendering/`, `src/components/`
- [X] Create `App.svelte` with split layout (controls left, visualization right)
- [X] Add CSS variables for colors and spacing in `app.css`
- [X] Start dev server: `npm run dev`

## Verify
- [X] Open http://localhost:5173 and see the split layout

## Resources
- Svelte components: https://svelte.dev/docs#components
- Svelte 5 runes: https://svelte.dev/docs/runes
- Vite: https://vitejs.dev/guide/