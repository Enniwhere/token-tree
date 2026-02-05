# Issue 7: Implement branch continuation logic

## Description

Implement the logic for continuing branches when players click on alternative tokens. This involves making additional LLM API calls to generate continuation tokens for the selected branch.

## Tasks

- [ ] Extend `LLMBackend` interface:
  - Add method: `continue_generation(base_prompt: String, branch_tokens: Array, params: Dictionary) -> Array`
  - This method generates tokens continuing from a specific branch

- [ ] Implement `continue_generation()` in `OllamaBackend`:
  - Construct prompt from base prompt + branch tokens
  - Call Ollama API with modified prompt
  - Return continuation tokens with probabilities
  - Handle streaming responses (future enhancement)

- [ ] Create `BranchManager` class (`scripts/branch_manager.gd`):
  ```gdscript
  class_name BranchManager
  extends RefCounted

  var max_branches: int = 5
  var branch_colors: Array[Color] = [
      Color.RED, Color.PURPLE, Color.ORANGE, Color.GREEN, Color.CYAN
  ]

  func create_branch(start_token: TokenData, alternative_token: TokenData) -> BranchData:
      # Create new branch from alternative token
      pass

  func continue_branch(branch: BranchData, num_tokens: int = 10) -> void:
      # Generate continuation tokens for branch
      pass

  func get_next_color() -> Color:
      # Get next available color for branch
      pass

  func can_create_branch() -> bool:
      # Check if max branches not exceeded
      pass
  ```

- [ ] Implement branch creation flow:
  1. Player clicks alternative token
  2. Create new BranchData with unique ID
  3. Assign color from palette
  4. Add to GameState.active_branches
  5. Trigger continuation generation
  6. Update visualization when tokens arrive

- [ ] Implement continuation generation:
  1. Construct prompt from base + branch tokens
  2. Call LLM backend with modified prompt
  3. Parse response into TokenData array
  4. Link tokens to branch
  5. Store in GameState.branch_continuations
  6. Emit signal: `branch_continuated`

- [ ] Add branch management UI:
  - List of active branches with colors
  - "Remove branch" button for each branch
  - "Continue branch" button to generate more tokens
  - Branch visibility toggle

- [ ] Handle edge cases:
  - Max branches reached (show warning)
  - Branch continuation fails (show error)
  - Duplicate branch creation (prevent or merge)
  - Branch with no continuations (allow deletion)

- [ ] Add branch scoring:
  - Calculate cumulative probability for branch
  - Higher probability = higher score
  - Score formula: `base_score * cumulative_probability * length_multiplier`

## Acceptance Criteria

- [ ] Clicking alternative token creates new branch
- [ ] Branch continuation generates tokens from LLM
- [ ] Branches have distinct colors
- [ ] Branch UI shows active branches
- [ ] Branches can be removed
- [ ] Branch continuation can be triggered manually
- [ ] Max branches limit is enforced
- [ ] Errors are handled gracefully

## Notes

- Branch IDs should be unique and persistent
- Branch colors should be visually distinct
- Continuation should use same parameters as initial generation
- Consider caching continuations to reduce API calls
- Branch scoring should reward both probability and length

## Branch Data Structure

```gdscript
class BranchData:
    var id: String  # Unique identifier
    var tokens: Array[TokenData]  # Tokens in this branch
    var is_active: bool  # Whether branch is visible
    var color: Color  # Visual color
    var start_position: int  # Where branch diverges
    var divergence_token: TokenData  # The alternative token that started this branch
    var continuations: Array[TokenData]  # Generated continuation tokens
    var score: int  # Branch score
```

## Related Issues

- #2: LLM abstraction
- #3: Token data structures
- #6: Tree rendering

## Future Work

- Support branch merging
- Add branch comparison view
- Implement branch history/undo
- Allow manual branch editing
- Add branch export/save
