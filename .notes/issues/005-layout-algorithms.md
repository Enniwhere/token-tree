# Issue 5: Implement pluggable layout algorithm system

## Description

Create a flexible system for tree layout algorithms that allows experimentation with different approaches. Implement at least two algorithms (simple tree layout and force-directed) to compare their effectiveness for the token tree visualization.

## Tasks

- [ ] Create `LayoutAlgorithm` base class (`scripts/layout_algorithm.gd`):
  ```gdscript
  class_name LayoutAlgorithm
  extends RefCounted

  # Layout tokens and return position data
  func layout(tokens: Array[TokenData], branches: Array[BranchData]) -> Dictionary:
      # Returns: { token_id: Vector2 position, connections: Array }
      pass

  # Get algorithm name for UI
  func get_name() -> String:
      pass

  # Get algorithm description
  func get_description() -> String:
      pass
  ```

- [ ] Create `SimpleTreeLayout` implementation (`scripts/simple_tree_layout.gd`):
  - Horizontal layout: main path goes left to right
  - Alternatives positioned above/below main path
  - Fixed vertical spacing (80px)
  - Alternatives at same position stacked vertically
  - Simple and predictable, good for debugging

- [ ] Create `ForceDirectedLayout` implementation (`scripts/force_directed_layout.gd`):
  - Port concepts from POC (not direct code copy)
  - Forces:
    - Spring force: Maintain target distance from main path
    - Repulsion: Push alternatives away from main path
    - Alternative repulsion: Push alternatives apart at same position
    - Adjacent repulsion: Push alternatives apart at adjacent positions
  - Iterative relaxation (100-200 iterations)
  - Damping factor (0.5)
  - More organic, "tree-like" appearance

- [ ] Create `LayoutConfig` resource (`resources/layout_config.tres`):
  - Default algorithm selection
  - Algorithm-specific parameters:
    - SimpleTreeLayout: vertical_spacing, horizontal_spacing
    - ForceDirectedLayout: iterations, spring_strength, repulsion_strength, damping
  - Node dimensions for calculations

- [ ] Create `LayoutManager` class (`scripts/layout_manager.gd`):
  - Manage current algorithm
  - Switch between algorithms at runtime
  - Cache layout results
  - Trigger re-layout when tokens/branches change
  - Signal: `layout_completed(positions: Dictionary)`

- [ ] Integrate with GameManager:
  - Add LayoutManager instance
  - Trigger layout after token generation
  - Expose method to switch algorithms
  - Connect layout_completed to update token node positions

- [ ] Add UI controls for algorithm selection:
  - Dropdown to select algorithm
  - Sliders for algorithm parameters
  - "Relayout" button to apply changes

## Acceptance Criteria

- [ ] LayoutAlgorithm base class defines clear interface
- [ ] SimpleTreeLayout produces predictable horizontal tree
- [ ] ForceDirectedLayout produces organic tree structure
- [ ] LayoutManager can switch between algorithms
- [ ] UI controls allow algorithm selection and parameter adjustment
- [ ] Layout updates trigger token node position changes
- [ ] Both algorithms handle branches correctly

## Notes

- SimpleTreeLayout is good for debugging and understanding structure
- ForceDirectedLayout should be more visually appealing but less predictable
- Keep algorithms independent for easy experimentation
- Consider adding more algorithms later (hierarchical, radial, etc.)
- Layout should be fast enough for real-time interaction (< 100ms for 50 tokens)

## Algorithm Details

### SimpleTreeLayout
```
Main path: (x, y) = (position * horizontal_spacing, base_y)
Alternatives: (x, y) = (position * horizontal_spacing, base_y ± offset)
Offset calculation: Stack alternatives above/below main path
```

### ForceDirectedLayout
```
For each iteration:
  1. Apply spring force to alternatives (toward main path)
  2. Apply repulsion from main path
  3. Apply repulsion between alternatives at same position
  4. Apply repulsion between alternatives at adjacent positions
  5. Apply damping
  6. Update positions
```

## Related Issues

- #3: Token data structures
- #4: Token node scene
- #6: Rendering system

## Future Work

- Add HierarchicalLayout for structured trees
- Add RadialLayout for circular visualization
- Implement animated layout transitions
- Add layout presets for different use cases
- Optimize for large trees (100+ tokens)
