# Web Implementation Issues

This folder contains the development issues for the web-first implementation of the Token Tree Game using Svelte, HTML5 Canvas, and WebLLM.

## Overview

The web implementation mirrors the Godot plan but adapts it for web technologies:
- **Godot** → **Svelte** (component framework)
- **GDScript** → **TypeScript/JavaScript**
- **Godot scenes** → **Svelte components**
- **Godot Control nodes** → **HTML/CSS**
- **Godot CanvasLayer** → **HTML5 Canvas**
- **Ollama API** → **WebLLM (browser-based inference)**

## Development Phases

### Phase 1: Foundation (Issues 1-3)
- [x] #001: Project structure and basic UI
- [x] #002: LLM abstraction layer and WebLLM integration
- [x] #003: Token data structures and game state

### Phase 2: Core Components (Issues 4-6)
- [x] #004: Token node component with interactivity
- [x] #005: Pluggable layout algorithm system
- [x] #006: Canvas rendering system

### Phase 3: Gameplay Mechanics (Issues 7-8)
- [x] #007: Branch continuation logic
- [x] #008: UI controls and gameplay mechanics

### Phase 4: Polish & Deployment (Issues 9-10)
- [x] #009: Visual polish and animations
- [x] #010: Deployment and documentation

## Tutorial Approach

Each issue is designed as a learning exercise that introduces specific technologies:

| Issue | Technology | Concepts Learned |
|-------|-------------|------------------|
| #001 | Svelte basics | Components, props, `$state` runes, Vite |
| #002 | WebLLM | Browser-based LLM, async/await, progress callbacks |
| #003 | Svelte reactivity | `$derived`, `$effect`, state management |
| #004 | Svelte events | Event handling, transitions, conditional classes |
| #005 | Layout algorithms | Coordinate systems, vector math, strategy pattern |
| #006 | Canvas API | Drawing primitives, hit detection, animations |
| #007 | Async workflows | Async operations, loading states, error handling |
| #008 | Form handling | Bindings, search algorithms, scoring |
| #009 | Visual polish | CSS animations, particles, transitions |
| #010 | Deployment | Build optimization, Nginx, documentation |

## Key Differences from Godot Implementation

### Advantages
- **Browser deployment**: Share via URL, no download required
- **Client-side LLM**: WebLLM runs in browser, no server needed
- **Hot reload**: Instant feedback during development
- **Modern tooling**: TypeScript, ESLint, Prettier

### Trade-offs
- **Model download**: First load requires 1-4GB download (cached afterward)
- **WebGPU requirement**: Requires modern browser with WebGPU support
- **Build step**: Vite required for production builds (but simple)

## Technology Stack

- **Framework**: Svelte 5 (with runes for reactivity)
- **Build Tool**: Vite
- **Rendering**: HTML5 Canvas
- **LLM**: WebLLM (@mlc-ai/web-llm)
- **Language**: TypeScript (optional but recommended)
- **Styling**: CSS with CSS variables

## Project Structure

```
token-tree-web/
├── src/
│   ├── lib/
│   │   ├── llm/              # LLM abstraction and implementations
│   │   ├── game/             # Game logic and state management
│   │   └── rendering/        # Canvas rendering
│   ├── components/            # Svelte components
│   ├── app.css               # Global styles
│   └── main.ts              # Entry point
├── docs/                     # Documentation
├── index.html                # HTML shell
├── package.json
├── vite.config.ts
└── tsconfig.json
```

## Getting Started

1. **Create Svelte project** (Issue #001):
   ```bash
   npm create vite@latest token-tree-web -- --template svelte
   cd token-tree-web
   npm install
   ```

2. **Follow issues in order**: Each issue builds on the previous ones

3. **Learn as you build**: Each issue includes tutorial notes and resources

4. **Test frequently**: Run `npm run dev` and verify each step works

## Success Criteria

The web implementation is complete when:
- [ ] Tokens can be generated from WebLLM with probabilities
- [ ] Token tree is visualized with main path and alternatives
- [ ] Alternatives can be clicked to explore branches
- [ ] Parameters (temperature, top-k) can be adjusted
- [ ] Target substrings can be searched in tree
- [ ] Paths are scored based on probability
- [ ] Game can be deployed as static files
- [ ] Documentation is complete

## Future Enhancements

After completing all issues, consider:
- Adding server-hosted LLM backend
- Implementing more layout algorithms
- Adding undo/redo functionality
- Implementing save/load game state
- Adding multiplayer features
- Creating educational modules

## Related Documentation

- [Web Project Plan](../web-project-plan.md) - Overall project plan
- [Godot Project Plan](../project-plan.md) - Original Godot plan
- [Godot Issues](../issues/) - Original Godot implementation issues

## Notes for AI Assistants

When working on these issues:
1. **Read the tutorial notes** - Each issue explains what you'll learn
2. **Follow the code examples** - They demonstrate the concepts
3. **Explain your choices** - Help the user understand the technology
4. **Keep it simple** - Avoid overengineering, focus on learning
5. **Test incrementally** - Verify each step before moving on
6. **Reference resources** - Point to documentation for deeper learning

The user is learning Svelte, Canvas, and WebLLM while building this game. Treat each issue as a teaching opportunity, not just a task to complete.