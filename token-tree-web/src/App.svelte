<script lang="ts">
  import LLMLoader from './components/LLMLoader.svelte';
  import TokenNode from './components/TokenNode.svelte';
  import { CanvasRenderer } from './lib/rendering/canvas-renderer';
  import { HangingTreeLayout } from './lib/game/layout/tree-layout';
  import { createGameState } from './lib/game/state-manager';
  import type { TokenNode as TokenNodeType } from './lib/llm/backend';

  const game = createGameState();
  let backend = $state(null);
  let selectedNode = $state<string | null>(null);
  let canvasElement = $state<HTMLCanvasElement | null>(null);
  let renderer = $state<CanvasRenderer | null>(null);

  // Test data - create sample tokens with different probabilities
  const testTree: TokenNodeType = {
    id: '1',
    prompt: '',
    token: 'The',
    probability: 1.0,
    cumprob: 1.0,
    root: true,
    children: [
      {
        id: '2',
        prompt: 'The',
        token: 'quick',
        probability: 0.85,
        cumprob: 0.85,
        root: false,
        children: [
          {
            id: '5',
            prompt: 'The quick',
            token: 'brown',
            probability: 0.92,
            cumprob: 0.78,
            root: false,
            children: []
          },
          {
            id: '6',
            prompt: 'The quick',
            token: 'red',
            probability: 0.08,
            cumprob: 0.07,
            root: false,
            children: []
          }
        ]
      },
      {
        id: '3',
        prompt: 'The',
        token: 'slow',
        probability: 0.10,
        cumprob: 0.10,
        root: false,
        children: []
      },
      {
        id: '4',
        prompt: 'The',
        token: 'lazy',
        probability: 0.05,
        cumprob: 0.05,
        root: false,
        children: []
      }
    ]
  };

  $effect(() => {
    if (canvasElement && backend) {
      renderer = new CanvasRenderer(canvasElement);

      const layout = new HangingTreeLayout().computeLayout(testTree);

      const rect = canvasElement.getBoundingClientRect();
      renderer.resize(rect.width, rect.height);

      renderer.render(testTree, layout);
    }
  });

  function handleCanvasClick(event: MouseEvent) {
    if (!renderer) return;

    const rect = canvasElement!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const layout = new HangingTreeLayout().computeLayout(testTree);
    const clickedNodeId = renderer.getNodeAtPosition(x, y, layout);

    if (clickedNodeId) {
      const findNodeById = (node: TokenNodeType, id: string): TokenNodeType | null => {
        if (node.id === id) return node;
        for (const child of node.children) {
          const result = findNodeById(child, id);
          if (result) return result;
        }
        return null;
      };

      const clickedNode = findNodeById(testTree, clickedNodeId);
      if (clickedNode) {
        handleNodeClick(clickedNode);
      }
    }
  }

  function handleNodeClick(node: TokenNodeType) {
    selectedNode = node.prompt + ' ' + node.token;
    console.log('Clicked:', node.token, 'Probability:', node.probability);
  }

  function handleLoad(loadedBackend) {
    backend = loadedBackend;
    console.log('Model loaded!', backend);
  }

  function handleError(error) {
    console.error('Failed to load model:', error);
  }
</script>

<div class="container">
  <aside class="controls">
    <LLMLoader onLoad={handleLoad} onError={handleError} />
  </aside>
  <main class="visualization">
    {#if backend}
      <div class="test-area">
        <h2>TokenTree Test</h2>
        
        <canvas 
          id="tree-canvas"
          bind:this={canvasElement}
          onclick={handleCanvasClick}
          style="width: 100%; height: 400px; border: 1px solid var(--color-border); border-radius: 8px;"
        ></canvas> 

      </div>
    {:else}
      <div class="placeholder">
        Load a model to begin
      </div>
    {/if}
  </main>
</div>

<style>
  .container {
    display: flex;
    height: 100vh;
    width: 100%;
  }

  .controls {
    width: var(--controls-width);
    background-color: var(--color-background-light);
    border-right: 1px solid var(--color-border);
    padding: var(--spacing-lg);
    overflow-y: auto;
  }

  .visualization {
    flex: 1;
    padding: var(--spacing-lg);
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .ready-message {
    font-size: var(--font-size-xl);
    color: var(--color-success);
    text-align: center;
  }

  .placeholder {
    font-size: var(--font-size-lg);
    color: var(--color-text-muted);
    text-align: center;
  }
  
  .test-area {
    padding: var(--spacing-lg);
  }

  .test-area h2 {
    margin-bottom: var(--spacing-lg);
    color: var(--color-text);
  }

  .nodes-grid {
    display: flex;
    flex-wrap: wrap;
    gap: var(--spacing-lg);
    padding: var(--spacing-lg);
    background: var(--color-background-light);
    border-radius: 8px;
  }

  .selection-info {
    margin-top: var(--spacing-lg);
    padding: var(--spacing-md);
    background: var(--color-background-light);
    border-radius: 4px;
  }
</style>