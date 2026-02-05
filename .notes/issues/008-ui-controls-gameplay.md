# Issue 8: Implement UI controls and gameplay mechanics

## Description

Create the UI controls for adjusting generation parameters and implement the core gameplay mechanics including target substring search and scoring system.

## Tasks

- [ ] Create parameter control panel (`ui/parameter_panel.tscn`):
  - Temperature slider (0.0 to 2.0, default 0.7)
  - Top-K slider (1 to 10, default 4)
  - Max tokens slider (1 to 200, default 50)
  - Min probability slider (0% to 100%, default 5%)
  - Model selector dropdown
  - "Apply" button to update parameters

- [ ] Create gameplay control panel (`ui/gameplay_panel.tscn`):
  - Target substring input (LineEdit)
  - "Search" button to find substring in tree
  - Score display (Label)
  - "New generation" button
  - "Clear branches" button
  - "Reset" button

- [ ] Implement parameter management:
  - Store parameters in GameState
  - Update LLMBackend when parameters change
  - Validate parameter ranges
  - Show current values next to sliders

- [ ] Implement target substring search:
  ```gdscript
  func find_substring_in_tree(substring: String) -> Array[Dictionary]:
      # Search all tokens and branches for substring
      # Return array of matches with:
      # - token text
      # - position
      # - branch_id
      # - cumulative_probability
      # - context (surrounding tokens)
  ```

- [ ] Implement scoring system:
  - Base score for finding target substring
  - Multiplier based on cumulative probability (higher = better)
  - Multiplier based on branch length (longer = better)
  - Bonus for finding multiple occurrences
  - Penalty for low-probability paths

  ```gdscript
  func calculate_score(match: Dictionary) -> int:
      var base_score = 100
      var probability_multiplier = match.cumulative_probability * 10
      var length_multiplier = 1.0 + (match.branch_length * 0.1)
      return int(base_score * probability_multiplier * length_multiplier)
  ```

- [ ] Create search results panel:
  - List of found substrings with context
  - Show probability and score for each match
  - Click to navigate to match in tree
  - Highlight matching tokens

- [ ] Add visual feedback for scoring:
  - Score animation when points earned
  - Floating text for score changes
  - Progress bar for total score
  - High score display

- [ ] Implement generation controls:
  - "Generate" button to start new generation
  - Loading indicator during generation
  - Error display for failed generations
  - Progress bar for streaming generation (future)

- [ ] Add keyboard shortcuts:
  - Ctrl+Enter: Generate
  - Ctrl+F: Search
  - Ctrl+R: Reset
  - Escape: Clear selection

## Acceptance Criteria

- [ ] Parameter sliders work and update LLM backend
- [ ] Target substring search finds all occurrences
- [ ] Scoring system calculates scores correctly
- [ ] Search results display with context
- [ ] Clicking search result navigates to token
- [ ] Score updates with visual feedback
- [ ] Generation controls work correctly
- [ ] Keyboard shortcuts work

## Notes

- Keep UI clean and minimal
- Use tooltips to explain parameters
- Show parameter values in real-time
- Search should be case-insensitive
- Score formula should be tunable via config

## Parameter Explanations

**Temperature**: Controls randomness (0.0 = deterministic, 2.0 = very random)
**Top-K**: Number of alternative tokens to show at each position
**Max Tokens**: Maximum number of tokens to generate
**Min Probability**: Minimum probability threshold for showing alternatives

## Scoring Formula

```
score = base_score * probability_multiplier * length_multiplier

base_score = 100
probability_multiplier = cumulative_probability * 10
length_multiplier = 1.0 + (branch_length * 0.1)

Example:
- Base score: 100
- Cumulative probability: 0.5
- Branch length: 10 tokens
- Score = 100 * 5.0 * 2.0 = 1000
```

## Related Issues

- #2: LLM abstraction
- #3: Token data structures
- #7: Branch continuation

## Future Work

- Add difficulty levels (affect scoring)
- Implement achievements/milestones
- Add time-based challenges
- Create tutorial mode
- Add statistics/analytics
