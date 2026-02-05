# Token Tree Game - Project Plan

## Overview

A Godot 4.5 game where players explore LLM token generation trees, selecting likely tokens to guide AI responses toward target substrings. Players manipulate generation probabilities to find optimal paths through the token tree.

## Platform & Architecture

**Primary Platform**: Desktop (Windows, macOS, Linux) via Godot native export
**LLM Backend**: Local Ollama (user-installed separately)
**Future Support**: Web version (cloud LLM or WebLLM), server-hosted LLM

### Architecture Principles

1. **LLM Abstraction Layer**: Separate game logic from LLM backend to enable future web/cloud support
2. **Layout Algorithm Flexibility**: Design for easy experimentation with different tree layout algorithms
3. **Minimalist Aesthetic**: Clean, simple visual design with centralized theming for easy changes
4. **Quick Iteration**: Focus on visual components first, even as low-fidelity mocks

## Core Gameplay

- **Token Tree Visualization**: Sideways tree structure (left-to-right) showing main path and alternative branches
- **Branch Thickness**: Visual indicator of cumulative probability (thicker = more likely)
- **Interactive Exploration**: Click alternative tokens to explore different generation paths
- **Goal**: Search tree for target substrings, maximizing reward by choosing likely paths
- **Manipulation**: Adjust generation parameters (temperature, top-k) to influence token probabilities

## Technical Stack

- **Engine**: Godot 4.5 (GL Compatibility renderer)
- **Language**: GDScript
- **LLM Integration**: HTTP requests to Ollama API (localhost:11434)
- **UI System**: Godot Control nodes
- **Rendering**: Line2D, custom drawing on CanvasLayer

## Development Phases

### Phase 1: Foundation (Issues 1-3)
- Project structure and basic UI
- LLM abstraction layer and Ollama integration
- Token data structures

### Phase 2: Core Components (Issues 4-6)
- Token node scene with interactivity
- Layout algorithm system (pluggable, experimental)
- Rendering system for tree visualization

### Phase 3: Gameplay Mechanics (Issues 7-8)
- Branch continuation logic
- UI controls and parameter adjustment
- Target substring search and scoring

### Phase 4: Polish & Alpha (Issues 9-10)
- Visual polish and juice
- Export configuration and documentation
- Alpha deployment and feedback collection

## Key Design Decisions

### LLM Abstraction
```gdscript
# Interface for LLM backends
class_name LLMBackend
extends RefCounted

func generate_tokens(prompt: String, params: Dictionary) -> Array:
    pass

# Ollama implementation
class_name OllamaBackend
extends LLMBackend

# Future: CloudBackend, WebLLMBackend, etc.
```

### Layout Algorithm System
```gdscript
# Interface for layout algorithms
class_name LayoutAlgorithm
extends RefCounted

func layout(tokens: Array) -> Dictionary:
    pass

# Multiple implementations for experimentation
class_name ForceDirectedLayout
extends LayoutAlgorithm

class_name TreeLayout
extends LayoutAlgorithm

class_name HierarchicalLayout
extends LayoutAlgorithm
```

### Visual Theme System
Centralized configuration for colors, fonts, spacing to enable easy aesthetic changes.

## Reference Implementation

Existing web-based POC in `.notes/poc/` provides:
- Token data structure design
- Force-directed layout algorithm (as reference, not direct port)
- Rendering approach (layered visualization)
- Ollama API integration pattern

## Success Criteria for Alpha

- [ ] Generate tokens from Ollama with probabilities
- [ ] Visualize token tree with main path and alternatives
- [ ] Click alternatives to explore branches
- [ ] Adjust temperature and top-k parameters
- [ ] Search for target substrings in tree
- [ ] Score paths based on probability
- [ ] Export to Windows/macOS/Linux
- [ ] Deploy and collect feedback

## Future Considerations

1. **Web Version**: Requires LLM abstraction layer + cloud API or WebLLM integration
2. **Server-Hosted LLM**: Same abstraction layer, different backend implementation
3. **Advanced Features**: Branch history, undo/redo, statistics, export/save
4. **Performance**: Virtualization for large trees, progressive rendering, caching
