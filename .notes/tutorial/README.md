# Token Tree Web - Tutorial

A web-based game where players explore LLM token generation trees. Build this project to learn Svelte, HTML5 Canvas, and WebLLM.

## Tech Stack

- **Svelte 5** - Component framework with runes for reactivity
- **Vite** - Fast build tool with hot reload
- **HTML5 Canvas** - 2D rendering for tree visualization
- **WebLLM** - Browser-based LLM inference (WebGPU required)
- **TypeScript** - Type safety (optional but recommended)

## Prerequisites

- Node.js 18+
- Modern browser with WebGPU support (Chrome 113+, Edge 113+, Firefox Nightly)

## Tutorial Steps

Complete steps in order. Each step teaches specific concepts.

| Step | Title | Learn |
|------|-------|-------|
| [00](00-setup.md) | Setup | Node.js, npm |
| [01](01-project-structure.md) | Project Structure | Svelte components, Vite, $state runes |
| [02](02-llm-abstraction.md) | LLM Abstraction | WebLLM, async/await, TypeScript interfaces |
| [03](03-token-data-structures.md) | Data Structures | $derived, $effect, state management |
| [04](04-token-node-component.md) | Token Node Component | Event handling, transitions, conditional classes |
| [05](05-layout-algorithms.md) | Layout Algorithms | Coordinate systems, positioning algorithms |
| [06](06-canvas-rendering.md) | Canvas Rendering | Canvas API, drawing primitives, hit detection |
| [07](07-branch-continuation.md) | Branch Continuation | Async workflows, loading states, error handling |
| [08](08-ui-controls-gameplay.md) | UI Controls & Gameplay | Form bindings, search, scoring |
| [09](09-visual-polish.md) | Visual Polish | CSS animations, Svelte transitions, visual effects |
| [10](10-deployment.md) | Deployment | Build optimization, Nginx, production deployment |

## How to Use This Tutorial

1. **Read the Concepts** section - Brief theory before doing
2. **Complete the Actions** - Check off each item as you go
3. **Verify** - Confirm it works before moving on
4. **Stuck?** - Check the Resources links to official docs

## For AI Assistants

When helping with this tutorial:
- Explain concepts before showing code
- Let the user figure out implementation details
- Reference the Concepts section
- Ask if they understand before proceeding
- Verify each step works before moving to the next

## Project Structure

```
token-tree-web/
├── src/
│   ├── lib/
│   │   ├── llm/              # LLM abstraction and WebLLM
│   │   ├── game/             # Game logic and state
│   │   └── rendering/        # Canvas rendering
│   ├── components/            # Svelte components
│   ├── app.css
│   └── main.ts
├── index.html
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Common Commands

```bash
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production
npm run preview  # Preview production build
```

## Game Overview

Players explore LLM token generation trees by:
- Viewing the main generation path and alternative branches
- Clicking alternative tokens to explore different paths
- Adjusting temperature and top-k to influence probabilities
- Searching for target substrings to maximize score

Branch thickness shows cumulative probability (thicker = more likely).

## WebGPU Support

WebLLM requires WebGPU. If not supported:
- Use Chrome 113+ or Edge 113+
- Enable WebGPU in `chrome://flags`
- Try Firefox Nightly

## License

See [LICENSE](../LICENSE) in the parent directory.