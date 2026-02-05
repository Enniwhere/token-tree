# Issue 4: Create TokenNode scene with interactivity

## Description

Create a reusable TokenNode scene that displays individual tokens with click detection and hover states. This is the fundamental building block for the token tree visualization.

## Tasks

- [ ] Create `TokenNode` scene (`scenes/token_node.tscn`):
  - Root: Control node
  - Child: Label for token text
  - Child: ColorRect for background (optional, for hover/selection)
  - Child: Panel for probability indicator (optional)

- [ ] Create `TokenNode` script (`scripts/token_node.gd`):
  ```gdscript
  class_name TokenNode
  extends Control

  var token_data: TokenData
  var is_alternative: bool = false
  var is_hovered: bool = false
  var is_selected: bool = false

  signal clicked(token_node: TokenNode)
  signal hovered(token_node: TokenNode)
  signal unhovered(token_node: TokenNode)

  func set_token_data(data: TokenData):
      # Update text, styling based on token data

  func _on_mouse_entered():
      # Handle hover state

  func _on_mouse_exited():
      # Handle unhover state

  func _on_gui_input(event):
      # Handle click events
  ```

- [ ] Implement visual states:
  - **Main path token**: Larger font (18px), darker color, blue accent
  - **Alternative token**: Smaller font (14px), lighter color, subtle background
  - **Hover state**: Darker background, blue text, cursor pointer
  - **Selected state**: Highlighted border or background

- [ ] Add probability visualization:
  - Small indicator showing token probability
  - Could be a bar, circle, or text percentage
  - Opacity or size based on probability

- [ ] Implement dynamic text sizing:
  - Measure text width to calculate node size
  - Add padding for visual comfort
  - Support word wrapping if needed (future)

- [ ] Create `TokenNode` pool for performance:
  - Pre-instantiate nodes for reuse
  - Reduce allocation overhead for large trees

- [ ] Add animation support:
  - Fade in on creation
  - Scale animation on hover
  - Smooth transitions between states

## Acceptance Criteria

- [ ] TokenNode scene displays token text correctly
- [ ] Main path and alternative tokens have distinct visual styles
- [ ] Hover state works with visual feedback
- [ ] Click events are emitted correctly
- [ ] Node size adjusts to text content
- [ ] Probability indicator displays correctly
- [ ] Animations are smooth and not distracting

## Notes

- Use Control node's `custom_minimum_size` for layout
- Connect signals in parent container (tree view)
- Keep animations subtle for "juice" without being distracting
- Consider using Theme resource for consistent styling

## Visual Design

**Main Path Token:**
- Font size: 18px
- Color: Dark blue (#2c3e50)
- Background: Transparent
- Padding: 4px 8px

**Alternative Token:**
- Font size: 14px
- Color: Light gray (#7f8c8d)
- Background: Transparent
- Padding: 2px 6px

**Hover State:**
- Background: Light blue (#e8f4f8)
- Text color: Blue (#3498db)
- Cursor: Pointer

**Selected State:**
- Border: 2px blue (#3498db)
- Background: Light blue (#d6eaf8)

## Related Issues

- #1: Project structure
- #3: Token data structures
- #5: Layout algorithm system

## Future Work

- Add keyboard navigation
- Support multi-token selection
- Add context menu for token actions
- Implement drag-and-drop for branch manipulation
