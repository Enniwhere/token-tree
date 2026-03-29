<script lang="ts">
  import LLMLoader from './components/LLMLoader.svelte';
  import TokenNode from './components/TokenNode.svelte';
  import { createGameState } from './lib/game/state-manager';
  import type { TokenNode as TokenNodeType } from './lib/llm/backend';

  const game = createGameState();
  let backend = $state(null);
  let selectedNode = $state<string | null>(null);
      // Test data - create sample tokens with different probabilities
  const testNodes: TokenNodeType[] = [
    {
      prompt: '',
      token: 'The',
      probability: 1.0,
      root: true,
      children: []
    },
    {
      prompt: 'The',
      token: 'quick',
      probability: 0.85,
      root: false,
      children: []
    },
    {
      prompt: 'The',
      token: 'slow',
      probability: 0.10,
      root: false,
      children: []
    },
    {
      prompt: 'The',
      token: 'lazy',
      probability: 0.05,
      root: false,
      children: []
    },
    {
      prompt: 'The quick',
      token: 'brown',
      probability: 0.92,
      root: false,
      children: []
    },
    {
      prompt: 'The quick',
      token: 'red',
      probability: 0.08,
      root: false,
      children: []
    }
  ];

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
        <h2>TokenNode Component Test</h2>
        <div class="nodes-grid">
          {#each testNodes as node}
            <TokenNode 
              node={node}
              isSelected={selectedNode === node.prompt + ' ' + node.token}
              onClick={() => handleNodeClick(node)}
            />
          {/each}
        </div>
        {#if selectedNode}
          <div class="selection-info">
            Selected: <strong>{selectedNode}</strong>
          </div>
        {/if}
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