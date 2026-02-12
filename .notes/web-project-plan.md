# Token Tree Game - Web Project Plan

## Overview

A web-based game where players explore LLM token generation trees, selecting likely tokens to guide AI responses toward target substrings. Players manipulate generation probabilities to find optimal paths through the token tree. Built with Svelte, HTML5 Canvas, and WebLLM for browser-based LLM inference.

## Platform & Architecture

**Primary Platform**: Web browser (Chrome 113+, Edge 113+, Firefox with WebGPU)
**Hosting**: Self-hosted on Raspberry Pi (static files)
**LLM Backend**: WebLLM (client-side WebGPU inference)
**Future Support**: Server-hosted LLM, Cloud APIs (via abstraction layer)

### Architecture Principles

1. **LLM Abstraction Layer**: Separate game logic from LLM backend to enable future server/cloud support
2. **Layout Algorithm Flexibility**: Design for easy experimentation with different tree layout algorithms
3. **Minimalist Aesthetic**: Clean, simple visual design with centralized theming for easy changes
4. **Tutorial-First Development**: Learn Svelte, Canvas, and WebLLM while building the game
5. **Component-Based Organization**: Clear separation of concerns for maintainability

## Core Gameplay

- **Token Tree Visualization**: Sideways tree structure (left-to-right) showing main path and alternative branches
- **Branch Thickness**: Visual indicator of cumulative probability (thicker = more likely)
- **Interactive Exploration**: Click alternative tokens to explore different generation paths
- **Goal**: Search tree for target substrings, maximizing reward by choosing likely paths
- **Manipulation**: Adjust generation parameters (temperature, top-k) to influence token probabilities

## Technical Stack

- **Framework**: Svelte 5 (with Svelte 5 runes for reactivity)
- **Build Tool**: Vite (fast dev server, hot reload)
- **Rendering**: HTML5 Canvas (2D context)
- **LLM Integration**: WebLLM (@mlc-ai/web-llm via CDN)
- **Language**: TypeScript 
- **Styling**: CSS with CSS variables for theming
- **Package Manager**: npm

## Development Phases

### Phase 1: Foundation (Issues 1-3)
- Svelte project setup and basic UI structure
- WebLLM integration and LLM abstraction layer
- Token data structures and game state management

### Phase 2: Core Components (Issues 4-6)
- Token node component with interactivity
- Layout algorithm system (pluggable, experimental)
- Canvas rendering system for tree visualization

### Phase 3: Gameplay Mechanics (Issues 7-8)
- Branch continuation logic
- UI controls and parameter adjustment
- Target substring search and scoring

### Phase 4: Polish & Deployment (Issues 9-10)
- Visual polish and animations
- Deployment configuration and documentation
- Testing and feedback collection

## Key Design Decisions

### LLM Abstraction
```typescript
// Interface for LLM backends
interface LLMBackend {
  generateTokens(prompt: string, params: GenerationParams): Promise<TokenData[]>;
  continueGeneration(basePrompt: string, branchTokens: string[], params: GenerationParams): Promise<TokenData[]>;
  getAvailableModels(): Promise<string[]>;
}

// WebLLM implementation
class WebLLMBackend implements LLMBackend {
  // WebLLM-specific implementation
}

// Future: ServerBackend, CloudBackend, etc.
```

### Layout Algorithm System
```typescript
// Interface for layout algorithms
interface LayoutAlgorithm {
  layout(tokens: TokenData[], branches: BranchData[]): LayoutResult;
  getName(): string;
  getDescription(): string;
}

// Multiple implementations for experimentation
class SimpleTreeLayout implements LayoutAlgorithm { }
class ForceDirectedLayout implements LayoutAlgorithm { }
class HierarchicalLayout implements LayoutAlgorithm { }
```

### Svelte Component Architecture
- **App.svelte**: Main application container
- **Controls.svelte**: Parameter sliders and buttons
- **TokenTree.svelte**: Tree visualization container
- **TokenNode.svelte**: Individual token display
- **BranchPanel.svelte**: Active branches management

### Canvas Rendering Strategy
- Use Canvas for tree visualization (connections, nodes)
- Use Svelte for UI controls and overlays
- Hybrid approach: Svelte manages state, Canvas handles rendering
- RequestAnimationFrame for smooth animations

### Visual Theme System
Centralized CSS variables for colors, fonts, spacing to enable easy aesthetic changes.

## Tutorial Learning Path

### Svelte Concepts (Learned in Order)
1. **Components and Props** (Issue 1): Basic Svelte component structure
2. **Reactivity with Runes** (Issue 3): `$state`, `$derived` for game state
3. **Event Handling** (Issue 4): Click, hover events on tokens
4. **Lifecycle** (Issue 5): `onMount` for Canvas initialization
5. **Slots and Composition** (Issue 6): Flexible component structure

### Canvas Concepts (Learned in Order)
1. **Basic Drawing** (Issue 5): Lines, shapes, text
2. **Coordinate Systems** (Issue 5): Positioning and transforms
3. **Hit Detection** (Issue 4): Detecting clicks on drawn elements
4. **Animations** (Issue 9): RequestAnimationFrame, smooth transitions
5. **Performance** (Issue 6): Efficient rendering techniques

### WebLLM Concepts (Learned in Order)
1. **Basic Setup** (Issue 2): Loading models, chat completions
2. **Logprobs** (Issue 2): Getting token probabilities
3. **Streaming** (Issue 7): Real-time token generation
4. **Workers** (Issue 2): Offloading computation to keep UI responsive

## Project Structure

```
token-tree-web/
├── src/
│   ├── lib/
│   │   ├── llm/
│   │   │   ├── backend.ts              # LLM abstraction interface
│   │   │   ├── webllm-backend.ts       # WebLLM implementation
│   │   │   └── types.ts                # Token data structures
│   │   ├── game/
│   │   │   ├── state.ts                # Game state management
│   │   │   ├── layout/
│   │   │   │   ├── algorithm.ts        # Layout algorithm interface
│   │   │   │   ├── tree-layout.ts      # Simple tree layout
│   │   │   │   └── force-layout.ts     # Force-directed layout
│   │   │   └── scoring.ts              # Path scoring logic
│   │   └── rendering/
│   │       ├── canvas-renderer.ts      # Canvas rendering
│   │       └── animations.ts           # Animation utilities
│   ├── components/
│   │   ├── App.svelte                  # Main app component
│   │   ├── Controls.svelte             # Parameter controls
│   │   ├── TokenTree.svelte            # Tree visualization container
│   │   ├── TokenNode.svelte            # Individual token display
│   │   └── BranchPanel.svelte          # Active branches management
│   ├── app.css                         # Global styles
│   └── main.ts                         # Entry point
├── index.html                          # HTML shell
├── package.json
├── vite.config.ts
├── tsconfig.json                       # Optional, if using TypeScript
└── README.md
```

## Success Criteria for Alpha

- [ ] Generate tokens from WebLLM with probabilities
- [ ] Visualize token tree with main path and alternatives
- [ ] Click alternatives to explore branches
- [ ] Adjust temperature and top-k parameters
- [ ] Search for target substrings in tree
- [ ] Score paths based on probability
- [ ] Deploy to Raspberry Pi as static files
- [ ] Test in modern browsers with WebGPU support

## Future Considerations

1. **Server-Hosted LLM**: Same abstraction layer, different backend implementation
2. **Advanced Features**: Branch history, undo/redo, statistics, export/save
3. **Performance**: Virtualization for large trees, progressive rendering, caching
4. **Accessibility**: Keyboard navigation, screen reader support
5. **Mobile Support**: Touch interactions, responsive design
