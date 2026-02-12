# Step 6: Canvas Rendering

**Learn:** Canvas API, drawing primitives, hit detection

## Concepts
- **Canvas API**: Draw shapes, lines, and text on HTML5 canvas
- **Drawing primitives**: Lines, curves, rectangles, text
- **Hit detection**: Detect clicks on drawn elements

## Actions
- [ ] Create `src/lib/rendering/canvas-renderer.ts` with CanvasRenderer class
- [ ] Implement resize() method to handle canvas sizing
- [ ] Implement render() method with layered drawing (connections, paths, nodes)
- [ ] Implement drawMainPath() with probability-based thickness
- [ ] Implement drawAlternativeConnections() with bezier curves
- [ ] Implement drawTokenNodes() with text rendering
- [ ] Add hit detection for clicking on canvas elements
- [ ] Test rendering with sample layout data

## Verify
- [ ] Token tree renders correctly on canvas

## Resources
- Canvas API: https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial