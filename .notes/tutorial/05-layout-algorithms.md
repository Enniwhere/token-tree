# Step 5: Layout Algorithms

**Learn:** Coordinate systems, positioning algorithms

## Concepts
- **Coordinate systems**: 2D positioning with x and y coordinates
- **Layout algorithms**: Calculate positions for tree visualization
- **Strategy pattern**: Pluggable algorithms for experimentation

## Actions
- [ ] Create `src/lib/game/layout/algorithm.ts` with LayoutAlgorithm interface and Point, LayoutResult, Connection types
- [ ] Create `src/lib/game/layout/tree-layout.ts` implementing SimpleTreeLayout
- [ ] Implement horizontal positioning for main path tokens
- [ ] Implement vertical stacking for alternative tokens
- [ ] Add connection tracking for main and alternative paths
- [ ] Test layout with sample token data

## Verify
- [ ] Tokens are positioned correctly in 2D space

## Resources
- Canvas coordinates: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Basic_usage