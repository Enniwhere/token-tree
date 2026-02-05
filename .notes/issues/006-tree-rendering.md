# Issue 6: Implement tree rendering system

## Description

Create a rendering system that visualizes the token tree with main path, alternative branches, and probability-based thickness. Use layered rendering for visual clarity and smooth transitions.

## Tasks

- [ ] Create `TreeRenderer` scene (`scenes/tree_renderer.tscn`):
  - Root: Control node (fills right panel)
  - Child: CanvasLayer for connections
  - Child: ScrollContainer for token nodes
  - Child: Control container for token nodes

- [ ] Create `TreeRenderer` script (`scripts/tree_renderer.gd`):
  ```gdscript
  class_name TreeRenderer
  extends Control

  var token_nodes: Dictionary  # token_id -> TokenNode
  var connection_lines: Array  # Array of Line2D nodes
  var current_layout: Dictionary

  func render_tree(tokens: Array[TokenData], branches: Array[BranchData], layout: Dictionary):
      # Create/update token nodes
      # Draw connections
      # Apply positions from layout

  func draw_main_path(tokens: Array[TokenData], positions: Dictionary):
      # Draw continuous shape with varying thickness

  func draw_alternative_connections(tokens: Array[TokenData], positions: Dictionary):
      # Draw curved lines from main path to alternatives

  func draw_branch_paths(branches: Array[BranchData], positions: Dictionary):
      # Draw colored paths for active branches
  ```

- [ ] Implement main path rendering:
  - Use Line2D with custom width curve
  - Sample 200 points along path for smooth thickness
  - Thickness range: 8px to 60px based on cumulative probability
  - Ease-in-out interpolation for smooth transitions
  - Color: Blue (#4a90e2)

- [ ] Implement alternative connections:
  - Bezier curves from main path to alternatives
  - Opacity: 0.15 (subtle)
  - Thickness based on token probability
  - Color: Light gray (#999)

- [ ] Implement branch path rendering:
  - Colored paths for active branches
  - Distinct colors for each branch (red, purple, orange, green, etc.)
  - Thickness based on cumulative probability
  - Smooth curves between tokens

- [ ] Create `ConnectionLine` helper class:
  - Generate bezier curve points
  - Calculate thickness at each point
  - Handle smooth transitions

- [ ] Add visual polish:
  - Glow effects on main path (optional)
  - Gradient colors for branches
  - Smooth animations when layout changes
  - Fade in new branches

- [ ] Implement layering:
  - Layer 1 (bottom): Alternative connections
  - Layer 2: Main path
  - Layer 3: Branch paths
  - Layer 4 (top): Token nodes

- [ ] Add zoom and pan:
  - Mouse wheel to zoom
  - Middle-click drag to pan
  - Zoom limits (0.5x to 3x)
  - Smooth interpolation

## Acceptance Criteria

- [ ] Main path renders with varying thickness based on probability
  - [ ] Alternative connections render as subtle bezier curves
  - [ ] Branch paths render with distinct colors
  - [ ] Token nodes positioned correctly from layout
  - [ ] Layering is correct (connections behind nodes)
  - [ ] Zoom and pan work smoothly
  - [ ] Rendering is fast enough for real-time interaction

## Notes

- Use Line2D for connections (efficient and flexible)
- CanvasLayer for connections to ensure proper z-ordering
- Consider using MeshInstance2D for complex shapes (future)
- Smooth thickness transitions are key for "juicy" feel
- Keep opacity low for alternatives to avoid visual clutter

## Visual Design

**Main Path:**
- Color: Blue (#4a90e2)
- Thickness: 8px (low probability) to 60px (high probability)
- Smooth transitions between thickness values

**Alternative Connections:**
- Color: Light gray (#999)
- Opacity: 0.15
- Thickness: 2px to 8px based on probability
- Bezier curves with control points

**Branch Paths:**
- Colors: Red (#c0392b), Purple (#8e44ad), Orange (#e67e22), Green (#27ae60), etc.
- Thickness: 4px to 40px based on cumulative probability
- Smooth curves between tokens

**Layering Order:**
1. Alternative connections (bottom)
2. Main path
3. Branch paths
4. Token nodes (top)

## Related Issues

- #4: Token node scene
- #5: Layout algorithms
- #7: Branch continuation logic

## Future Work

- Add glow effects and particles
- Implement animated branch growth
- Add export to image/SVG
- Support custom themes and color schemes
- Optimize for large trees (100+ tokens)
