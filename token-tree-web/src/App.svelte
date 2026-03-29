<script>
  import LLMLoader from './components/LLMLoader.svelte';
  import { createGameState } from './lib/game/state-manager';

  const game = createGameState();
  let backend = $state(null);

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
      <div class="ready-message">
        Model loaded! Ready to generate tokens.
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
</style>