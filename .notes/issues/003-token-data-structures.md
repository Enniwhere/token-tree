# Issue 3: Implement token data structures and state management

## Description

Define and implement the core data structures for tokens, branches, and game state. These structures will be used throughout the game for visualization, interaction, and scoring.

## Tasks

- [ ] Create `TokenData` class (`scripts/token_data.gd`):
  ```gdscript
  class_name TokenData
  extends RefCounted

  var text: String
  var probability: float  # 0.0 to 1.0
  var logprob: float
  var is_main_path: bool
  var alternatives: Array[TokenData]  # Alternative tokens at this position
  var position: int  # Index in sequence
  var parent: TokenData  # Parent token in tree
  var children: Array[TokenData]  # Child tokens (continuations)
  var branch_id: String  # ID for tracking branches
  var cumulative_probability: float  # Probability from root to this token
  ```

- [ ] Create `BranchData` class (`scripts/branch_data.gd`):
  ```gdscript
  class_name BranchData
  extends RefCounted

  var id: String
  var tokens: Array[TokenData]  # Tokens in this branch
  var is_active: bool
  var color: Color
  var start_position: int  # Where branch diverges from main path
  ```

- [ ] Create `GameState` class (`scripts/game_state.gd`):
  ```gdscript
  class_name GameState
  extends RefCounted

  var base_tokens: Array[TokenData]  # Main path tokens
  var active_branches: Array[BranchData]  # Currently explored branches
  var branch_continuations: Dictionary  # branch_id -> continuation tokens
  var current_prompt: String
  var target_substring: String  # Player's search target
  var parameters: Dictionary  # temperature, top_k, etc.
  var score: int  # Current score
  ```

- [ ] Implement state management in GameManager:
  - Store GameState instance
  - Methods for:
    - `start_new_generation(prompt: String, params: Dictionary)`
    - `add_branch(branch_data: BranchData)`
    - `remove_branch(branch_id: String)`
    - `get_token_at_position(position: int, branch_id: String = "") -> TokenData`
    - `calculate_branch_probability(branch_id: String) -> float`
    - `find_substring_in_tree(substring: String) -> Array[Dictionary]`

- [ ] Create utility functions:
  - `calculate_cumulative_probability(tokens: Array[TokenData]) -> float`
  - `find_common_ancestor(token1: TokenData, token2: TokenData) -> TokenData`
  - `get_branch_path(branch_id: String) -> Array[TokenData]`

- [ ] Add signals to GameManager:
  - `tokens_generated(tokens: Array[TokenData])`
  - `branch_added(branch: BranchData)`
  - `branch_removed(branch_id: String)`
  - `branch_continuated(branch_id: String, tokens: Array[TokenData])`
  - `score_changed(new_score: int)`

## Acceptance Criteria

- [ ] TokenData class properly represents tokens with all required fields
- [ ] BranchData class tracks branches with color and state
- [ ] GameState class manages all game state
- [ ] GameManager provides methods for state manipulation
- [ ] Signals are emitted correctly on state changes
- [ ] Utility functions work correctly for probability calculations

## Notes

- Use RefCounted for automatic memory management
- Branch IDs should be unique (use UUID or incrementing counter)
- Colors for branches should be distinct and readable
- Cumulative probability is product of individual token probabilities

## Related Issues

- #1: Project structure
- #2: LLM abstraction
- #4: Token node scene

## Future Work

- Add undo/redo functionality
- Implement branch history
- Add save/load game state
- Support multiple simultaneous generations
