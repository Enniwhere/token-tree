# Web Implementation Quick Reference

## Decision Summary

Based on your requirements (simplicity, minimalism, readability, single developer, teaching context), the recommended stack is:

### Chosen Stack
- **Framework**: Svelte 5 (simple, reactive, component-based)
- **Rendering**: HTML5 Canvas (sufficient for 2D, no heavy library needed)
- **LLM**: WebLLM (browser-based, no server required)
- **Build Tool**: Vite (fast, simple, hot reload)
- **Language**: TypeScript (optional but recommended for type safety)

### Why This Stack?
| Requirement | Solution |
|-------------|-----------|
| Self-host on Raspberry Pi | Static files, no server-side processing |
| Client-side LLM | WebLLM runs in browser via WebGPU |
| Simple & minimal | Svelte is intentionally simple, not overengineered |
| Easy to maintain | Component-based, clear separation of concerns |
| Jump back in easily | File structure is self-documenting |
| Teaching tool | Clean code, good documentation |
| Future LLM support | Abstraction layer enables swapping backends |

## Technology Comparison

### Frameworks
| Framework | Simplicity | Learning Curve | Build Step | Verdict |
|-----------|-------------|----------------|-------------|---------|
| Vanilla JS | ⭐⭐⭐⭐⭐ | Low | Optional | Too much boilerplate |
| Svelte | ⭐⭐⭐⭐ | Low | Required | ✅ Recommended |
| React | ⭐⭐ | Medium | Required | Overengineered |
| Vue | ⭐⭐⭐ | Low-Medium | Required | Good alternative |

### Rendering
| Option | Simplicity | Performance | Learning Curve | Verdict |
|--------|-------------|-------------|----------------|---------|
| HTML5 Canvas | ⭐⭐⭐⭐⭐ | Good | Low | ✅ Recommended |
| PixiJS | ⭐⭐⭐ | Excellent | Medium | Overkill for this project |
| SVG | ⭐⭐⭐⭐ | Good | Low | Good alternative |

### LLM Integration
| Option | Browser Support | Server Required | Model Size | Verdict |
|--------|----------------|-----------------|-------------|---------|
| WebLLM | WebGPU only | No | 1-4GB | ✅ Recommended |
| Local proxy | Any | Yes | Depends on server | Extra complexity |
| Cloud API | Any | Yes | N/A | Not local |

## Project Roadmap

### Phase 1: Foundation (Issues 1-3)
**Goal**: Set up project and integrate LLM
- Create Svelte project with Vite
- Implement WebLLM integration
- Define data structures and game state

**Time Estimate**: 4-6 hours

### Phase 2: Core Components (Issues 4-6)
**Goal**: Build visualization system
- Create interactive TokenNode component
- Implement layout algorithms
- Build Canvas rendering system

**Time Estimate**: 8-12 hours

### Phase 3: Gameplay (Issues 7-8)
**Goal**: Implement game mechanics
- Add branch continuation
- Create UI controls
- Implement search and scoring

**Time Estimate**: 6-8 hours

### Phase 4: Polish (Issues 9-10)
**Goal**: Deploy and document
- Add visual polish and animations
- Deploy to Raspberry Pi
- Write documentation

**Time Estimate**: 4-6 hours

**Total Estimate**: 22-32 hours

## Key Files Reference

### Configuration
- `vite.config.ts` - Build configuration
- `package.json` - Dependencies and scripts
- `tsconfig.json` - TypeScript configuration

### Core Logic
- `src/lib/llm/backend.ts` - LLM abstraction interface
- `src/lib/llm/webllm-backend.ts` - WebLLM implementation
- `src/lib/game/state.ts` - Game state management
- `src/lib/game/layout/` - Layout algorithms
- `src/lib/rendering/canvas-renderer.ts` - Canvas rendering

### Components
- `src/components/App.svelte` - Main app container
- `src/components/Controls.svelte` - Parameter controls
- `src/components/TokenTree.svelte` - Tree visualization
- `src/components/TokenNode.svelte` - Individual token
- `src/components/BranchPanel.svelte` - Branch management

### Documentation
- `README.md` - Project overview
- `docs/USER_GUIDE.md` - How to play
- `docs/DEVELOPER_GUIDE.md` - Architecture and development
- `docs/TROUBLESHOOTING.md` - Common issues

## Common Commands

```bash
# Development
npm run dev              # Start dev server (http://localhost:5173)
npm run build            # Build for production
npm run preview          # Preview production build

# Code Quality
npm run check            # Type checking
npm run lint             # Linting
npm run format           # Format code

# Deployment
./deploy.sh              # Deploy to Raspberry Pi
```

## Learning Path

### Svelte Concepts (in order of introduction)
1. **Components** (Issue #1) - Basic structure
2. **Props** (Issue #1) - Component inputs
3. **$state** (Issue #1) - Reactive state
4. **Events** (Issue #4) - Click, hover
5. **$derived** (Issue #3) - Computed values
6. **$effect** (Issue #3) - Side effects
7. **Transitions** (Issue #4) - Animations
8. **Slots** (Issue #6) - Component composition

### Canvas Concepts (in order of introduction)
1. **Setup** (Issue #6) - Getting context
2. **Drawing** (Issue #6) - Lines, shapes, text
3. **Coordinates** (Issue #5) - Positioning
4. **Hit detection** (Issue #6) - Click detection
5. **Animations** (Issue #9) - requestAnimationFrame
6. **Effects** (Issue #9) - Glow, gradients

### WebLLM Concepts (in order of introduction)
1. **Setup** (Issue #2) - Loading models
2. **Generation** (Issue #2) - Chat completions
3. **Logprobs** (Issue #2) - Token probabilities
4. **Continuation** (Issue #7) - Extending branches
5. **Workers** (Future) - Offloading computation

## Troubleshooting Quick Reference

### WebGPU Not Supported
- Use Chrome 113+ or Edge 113+
- Enable WebGPU in `chrome://flags`
- Try Firefox Nightly

### Model Loading Fails
- Check internet connection
- Try smaller model (Phi-3-mini)
- Clear browser cache
- Check console for errors

### Slow Performance
- Use smaller model
- Reduce max tokens
- Close other tabs
- Check GPU acceleration

### Build Errors
- Delete `node_modules` and `package-lock.json`
- Run `npm install`
- Check Node.js version (18+)

## Deployment Checklist

- [ ] Build production version: `npm run build`
- [ ] Test locally: `npm run preview`
- [ ] Configure Nginx on Raspberry Pi
- [ ] Copy `dist/` to `/var/www/token-tree/`
- [ ] Test from external device
- [ ] Test on different browsers
- [ ] Test on mobile devices
- [ ] Verify WebGPU support message
- [ ] Check all features work
- [ ] Update documentation if needed

## Future Enhancements

### Short Term
- Add TypeScript (if not using)
- Add ESLint and Prettier
- Add more layout algorithms
- Add keyboard shortcuts

### Medium Term
- Add server-hosted LLM backend
- Add undo/redo functionality
- Add save/load game state
- Add more visual polish

### Long Term
- Add multiplayer features
- Add educational modules
- Add analytics
- Add mobile app

## Resources

### Official Documentation
- [Svelte](https://svelte.dev/docs)
- [Svelte 5 Runes](https://svelte.dev/docs/runes)
- [Vite](https://vitejs.dev/guide/)
- [WebLLM](https://webllm.mlc.ai/docs/)
- [Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

### Tutorials
- [Svelte Tutorial](https://learn.svelte.dev/)
- [Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- [WebGPU Guide](https://webgpu.dev/)

### Community
- [Svelte Discord](https://svelte.dev/chat)
- [WebLLM Discord](https://discord.gg/9Xpy2HGBuD)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/svelte)

## Notes for AI Assistants

When helping with this project:
1. **Follow the issues** - Each issue is a self-contained learning exercise
2. **Explain concepts** - User is learning while building
3. **Keep it simple** - Avoid overengineering
4. **Test incrementally** - Verify each step
5. **Reference documentation** - Point to official docs
6. **Be patient** - User is new to these technologies

The goal is not just to complete the game, but to learn Svelte, Canvas, and WebLLM in the process.