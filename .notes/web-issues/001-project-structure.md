# Issue 1: Set up Svelte project and basic UI structure

## Description

Create the foundational Svelte project structure with a main component, basic UI layout, and game state management. This establishes the project architecture and enables rapid iteration on visual components.

**Tutorial Focus**: This issue introduces Svelte basics - components, props, and the Svelte 5 reactivity system (`$state` runes). You'll learn how Svelte's component model works and how to set up a project with Vite.

## Tasks

- [ ] Create Svelte project with Vite:
  ```bash
  npm create vite@latest token-tree-web -- --template svelte
  cd token-tree-web
  npm install
  ```

- [ ] Configure project structure:
  - `src/lib/` - Shared utilities and types
  - `src/lib/llm/` - LLM backend implementations
  - `src/lib/game/` - Game logic and state
  - `src/lib/rendering/` - Canvas rendering code
  - `src/components/` - Svelte components
  - `src/app.css` - Global styles

- [ ] Create `App.svelte` with split layout:
  ```svelte
  <script>
    // Learn: Svelte component structure, $state runes
    let parameters = $state({
      temperature: 0.7,
      top_k: 4,
      max_tokens: 50
    });
  </script>

  <div class="container">
    <div class="controls">
      <!-- Left panel for controls -->
    </div>
    <div class="visualization">
      <!-- Right panel for tree visualization -->
    </div>
  </div>

  <style>
    .container {
      display: grid;
      grid-template-columns: 300px 1fr;
      height: 100vh;
    }
  </style>
  ```

- [ ] Create basic CSS theme with CSS variables:
  ```css
  :root {
    --color-main-path: #4a90e2;
    --color-alternative: #999;
    --color-branch-1: #e74c3c;
    --color-branch-2: #9b59b6;
    --color-branch-3: #f39c12;
    --color-branch-4: #27ae60;
    --color-branch-5: #3498db;
    --font-main: 18px;
    --font-alternative: 14px;
    --spacing-token: 8px;
  }
  ```

- [ ] Create `Controls.svelte` component:
  ```svelte
  <script>
    // Learn: Props, event dispatching
    let { parameters } = $props();
  </script>

  <div class="controls">
    <label>
      Temperature: {parameters.temperature}
      <input type="range" min="0" max="2" step="0.1" />
    </label>
  </div>
  ```

- [ ] Configure Vite for development:
  - Set up dev server with hot reload
  - Configure port (default 5173)
  - Test that `npm run dev` works

- [ ] Verify project setup:
  - Run `npm run dev`
  - Open browser to http://localhost:5173
  - Confirm split layout displays correctly
  - Test that hot reload works when editing files

## Acceptance Criteria

- [ ] Svelte project created with Vite
- [ ] Project folder structure follows conventions
- [ ] App.svelte loads with split UI layout
- [ ] CSS theme applied with consistent colors and fonts
- [ ] Controls.svelte component renders in left panel
- [ ] Dev server runs without errors
- [ ] Hot reload works when editing files

## Tutorial Notes

**What you'll learn:**
- How to create a Svelte project with Vite
- Svelte component structure (script, template, style sections)
- Svelte 5 `$state` runes for reactive state
- Props and component communication
- CSS variables for theming
- Vite dev server and hot reload

**Key Svelte concepts:**
- Components are `.svelte` files with three sections: `<script>`, HTML template, `<style>`
- `$state()` creates reactive variables - when they change, the UI updates automatically
- `$props()` defines component inputs
- Vite provides instant hot reload during development

**Resources:**
- [Svelte Tutorial](https://learn.svelte.dev/)
- [Svelte 5 Runes](https://svelte.dev/docs/runes)
- [Vite Guide](https://vitejs.dev/guide/)

## Related Issues

- #2: LLM abstraction layer and WebLLM integration
- #3: Token data structures and game state

## Future Work

- Add TypeScript support (optional)
- Configure ESLint and Prettier
- Set up deployment for Raspberry Pi
