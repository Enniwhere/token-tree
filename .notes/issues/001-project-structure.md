# Issue 1: Set up Godot project structure and main scene

## Description

Create the foundational Godot project structure with a main scene, UI layout, and autoload singleton for global state management. This establishes the project architecture and enables rapid iteration on visual components.

## Tasks

- [ ] Create folder structure:
  - `scenes/` - Scene files
  - `scripts/` - GDScript files
  - `resources/` - Assets (fonts, themes, etc.)
  - `autoload/` - Singleton scripts
  - `ui/` - UI components
  - `llm/` - LLM backend implementations

- [ ] Create autoload singleton `GameManager.gd`:
  - Global state for tokens, branches, game parameters
  - Signals for game events (token generated, branch selected, etc.)
  - Configuration constants (spacing, sizes, colors)

- [ ] Create main scene `Main.tscn`:
  - Split layout: Left panel (300px) for controls, right panel for tree visualization
  - Left panel: Prompt input (TextEdit), parameter sliders, generate button, output display
  - Right panel: Scrollable container for token tree
  - CanvasLayer for rendering tree connections

- [ ] Create basic UI theme:
  - Define color palette (main path blue, alternatives gray, branches red)
  - Set up font sizes (main tokens 18px, alternatives 14px)
  - Create styleboxes for buttons, text inputs

- [ ] Configure project settings:
  - Application name: "Token Tree"
  - Window size: 1280x720 (resizable)
  - Renderer: GL Compatibility (already configured)

## Acceptance Criteria

- [ ] Project folder structure follows conventions
- [ ] GameManager autoload is registered and accessible
- [ ] Main scene loads with split UI layout
- [ ] UI theme applied with consistent colors and fonts
- [ ] Scene can be run without errors

## Notes

- Keep UI minimal and clean for quick iteration
- Use Control nodes with anchors for responsive layout
- Theme should be centralized for easy aesthetic changes later

## Related Issues

- #2: LLM abstraction layer
- #3: Token data structures
