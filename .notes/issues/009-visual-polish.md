# Issue 9: Visual polish and juice

## Description

Add visual polish and "juice" to make the game feel smooth, responsive, and satisfying. Focus on animations, transitions, and feedback that enhance the gameplay experience.

## Tasks

- [ ] Add token node animations:
  - Fade in on creation (0.2s ease-in)
  - Scale animation on hover (1.1x, 0.1s ease-out)
  - Pulse animation on selection
  - Shake animation on error

- [ ] Add connection line animations:
  - Animate main path drawing (left to right, 0.5s)
  - Fade in alternative connections (0.3s)
  - Animate branch path growth (0.5s per segment)
  - Smooth thickness transitions (0.2s)

- [ ] Add UI animations:
  - Button hover effects (scale, brightness)
  - Slider value change animations
  - Panel fade in/out
  - Score popup animation (float up and fade)

- [ ] Add particle effects:
  - Sparkles on high-probability tokens
  - Confetti on finding target substring
  - Smoke/glow on branch creation
  - Particles on score milestones

- [ ] Add sound effects (optional):
  - Click sounds for token selection
  - Whoosh for branch creation
  - Ding for scoring
  - Error buzz for failures
  - Ambient background sound (subtle)

- [ ] Add visual feedback:
  - Highlight tokens matching search query
  - Glow effect on high-probability paths
  - Color transitions for probability changes
  - Progress indicators for generation

- [ ] Add screen effects:
  - Screen shake on errors
  - Flash on score milestones
  - Vignette for focus
  - Subtle background animation

- [ ] Add transition effects:
  - Smooth camera pan when navigating tree
  - Zoom to selected token
  - Fade between layout algorithm changes
  - Smooth scroll to search results

- [ ] Add accessibility features:
  - High contrast mode
  - Colorblind-friendly palette
  - Adjustable animation speed
  - Reduced motion mode

## Acceptance Criteria

- [ ] Token nodes have smooth animations
- [ ] Connection lines animate smoothly
- [ ] UI elements have hover/active states
- [ ] Particle effects enhance key moments
- [ ] Sound effects (if added) are subtle and satisfying
- [ ] Visual feedback is clear and responsive
- [ ] Transitions are smooth and not jarring
- [ ] Accessibility options are available

## Notes

- Keep animations subtle (0.1s to 0.5s)
- Use easing functions for natural feel
- Don't overdo particles/effects
- Sound should be optional with volume control
- Test with reduced motion for accessibility

## Animation Timing

**Token Nodes:**
- Fade in: 0.2s ease-in
- Hover scale: 0.1s ease-out
- Selection pulse: 0.3s ease-in-out

**Connections:**
- Main path draw: 0.5s ease-out
- Alternative fade: 0.3s ease-in
- Branch growth: 0.5s per segment

**UI:**
- Button hover: 0.1s ease-out
- Panel fade: 0.2s ease-in-out
- Score popup: 0.5s ease-out (float up)

## Particle Effects

**Sparkles:**
- Trigger: High-probability tokens (> 0.8)
- Count: 5-10 particles
- Lifetime: 0.5s
- Color: Gold/yellow

**Confetti:**
- Trigger: Finding target substring
- Count: 20-30 particles
- Lifetime: 1.0s
- Colors: Multi-colored

**Branch Creation:**
- Trigger: New branch created
- Count: 10-15 particles
- Lifetime: 0.3s
- Color: Branch color

## Related Issues

- #4: Token node scene
- #6: Tree rendering
- #8: UI controls

## Future Work

- Add theme system for different visual styles
- Implement custom particle editor
- Add more sound effects and music
- Create visual presets (minimal, playful, dramatic)
- Add haptic feedback for game controllers
