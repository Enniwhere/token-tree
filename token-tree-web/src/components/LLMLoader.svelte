<script>
    import { onMount } from "svelte";
    import { WebLLMBackend } from "../lib/llm/webllm-backend.js";
    import { AVAILABLE_MODELS, DEFAULT_MODEL } from "../lib/llm/config.js";

    
    let { onLoad = (backend) => {}, onError = (error) => {} } = $props();

    let selectedModel = $state(DEFAULT_MODEL);
    let loading = $state(false);
    let progress = $state(0);
    let progressText = $state("");
    let error = $state(null);

    let backend = $state(null);

    async function loadModel() {
        loading = true;
        error = null;
        progress = 0;
        progressText = "Loading model...";

        try {
            const backendInstance = new WebLLMBackend(selectedModel);
            await backendInstance.loadModel((progressReport) => {
                progress = progressReport.progress;
                progressText = progressReport.text || `Loading model... (${Math.round(progress * 100)}%)`;
            });
            backend = backendInstance;
            progressText = "Model loaded successfully!";
            onLoad(backend);
        } catch (err) {
            error = err instanceof Error ? err.message : String(err);
            onError(error);
        } finally {
            loading = false;
        }
    }
</script>

<div class="loader-container">
  <h2>Load LLM Model</h2>

  <!-- Model selector with two-way binding -->
  <div class="model-selector">
    <label for="modelSelect">Select Model:</label>
    <select id="modelSelect" bind:value={selectedModel} disabled={loading}>
      {#each Object.entries(AVAILABLE_MODELS) as [id, model]}
        <option value={id}>
          {model.name} ({model.size}) - {model.description}
        </option>
      {/each}
    </select>
  </div>

  <!-- Conditional rendering based on state -->
  {#if loading}
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" style="width: {progress * 100}%"></div>
      </div>
      <div class="progress-text">{progressText}</div>
      <div class="progress-percent">{Math.round(progress * 100)}%</div>
    </div>
  {:else if error}
    <div class="error">
      <strong>Error:</strong> {error}
    </div>
  {:else if progressText === 'Model loaded successfully!'}
    <div class="success">
      ✓ {progressText}
    </div>
  {/if}

  <!-- Button with dynamic text and disabled state -->
  <button 
    class="load-button" 
    onclick={loadModel} 
    disabled={loading}
  >
    {loading ? 'Loading...' : 'Load Model'}
  </button>

  <div class="info">
    <p><strong>Note:</strong> First load will download the model (~1-2GB).</p>
    <p><strong>Requirements:</strong> WebGPU support (Chrome 113+, Edge 113+)</p>
  </div>
</div>

<style>
  .loader-container {
    padding: 1.5rem;
    max-width: 500px;
  }

  h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.5rem;
  }

  .model-selector {
    margin-bottom: 1.5rem;
  }

  .model-selector label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
  }

  .model-selector select {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 0.5rem;
    background-color: #fff;
    font-size: 1rem;
  }

  .progress-container {
    margin-bottom: 1.5rem;
  }

  .progress-bar {
    height: 8px;
    background-color: #e0e0e0;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 0.5rem;
  }

  .progress-fill {
    height: 100%;
    background-color: #3b82f6;
    transition: width 0.3s ease;
  }

  .progress-text {
    font-size: 0.875rem;
    color: #666;
    margin-bottom: 0.25rem;
  }

  .progress-percent {
    font-size: 1.25rem;
    font-weight: 600;
    color: #3b82f6;
  }

  .error {
    padding: 1rem;
    background-color: #fef2f2;
    border: 1px solid #f87171;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    color: #dc2626;
  }

  .success {
    padding: 1rem;
    background-color: #f0fdf4;
    border: 1px solid #4ade80;
    border-radius: 0.5rem;
    margin-bottom: 1.5rem;
    color: #16a34a;
  }

  .load-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #3b82f6;
    color: white;
    border: none;
    border-radius: 0.5rem;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;
  }

  .load-button:hover:not(:disabled) {
    background-color: #2563eb;
  }

  .load-button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  .info {
    margin-top: 1.5rem;
    padding: 1rem;
    background-color: #f9fafb;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    color: #6b7280;
  }

  .info p {
    margin: 0.25rem 0;
  }
</style>
