# Issue 2: Implement LLM abstraction layer and WebLLM integration

## Description

Create an abstraction layer for LLM backends that separates game logic from LLM implementation. This enables future support for server-hosted APIs or cloud LLMs. Implement the WebLLM backend as the first concrete implementation.

**Tutorial Focus**: This issue introduces WebLLM - how to load models in the browser, generate tokens with logprobs, and handle the asynchronous nature of LLM inference. You'll also learn about TypeScript interfaces for abstraction.

## Tasks

- [ ] Create LLM backend interface (`src/lib/llm/backend.ts`):
  ```typescript
  // Learn: TypeScript interfaces for abstraction
  export interface GenerationParams {
    temperature: number;
    top_k: number;
    max_tokens: number;
    logprobs?: boolean;
    top_logprobs?: number;
  }

  export interface TokenData {
    text: string;
    probability: number;
    logprob: number;
    is_main_path: boolean;
    alternatives: TokenData[];
    position: number;
  }

  export interface LLMBackend {
    generateTokens(prompt: string, params: GenerationParams): Promise<TokenData[]>;
    continueGeneration(basePrompt: string, branchTokens: string[], params: GenerationParams): Promise<TokenData[]>;
    getAvailableModels(): Promise<string[]>;
  }
  ```

- [ ] Create WebLLM backend implementation (`src/lib/llm/webllm-backend.ts`):
  ```typescript
  // Learn: WebLLM API, async/await, error handling
  import * as webllm from "@mlc-ai/web-llm";

  export class WebLLMBackend implements LLMBackend {
    private engine: any;
    private model: string;

    constructor(model: string = "Llama-3.2-1B-Instruct-q4f16_1-MLC") {
      this.model = model;
    }

    async initialize(progressCallback?: (progress: any) => void): Promise<void> {
      // Learn: Loading WebLLM models, progress callbacks
      this.engine = await webllm.CreateMLCEngine(
        this.model,
        { initProgressCallback: progressCallback }
      );
    }

    async generateTokens(prompt: string, params: GenerationParams): Promise<TokenData[]> {
      // Learn: WebLLM chat completion API, logprobs
      const response = await this.engine.chat.completions.create({
        messages: [{ role: "user", content: prompt }],
        temperature: params.temperature,
        max_tokens: params.max_tokens,
        logprobs: true,
        top_logprobs: params.top_logprobs || 4,
      });

      // Parse response into TokenData array
      return this.parseResponse(response);
    }

    private parseResponse(response: any): TokenData[] {
      // Learn: Parsing WebLLM response, calculating probabilities
      // Extract tokens, logprobs, and alternatives
    }
  }
  ```

- [ ] Create LLM configuration (`src/lib/llm/config.ts`):
  ```typescript
  export const DEFAULT_CONFIG = {
    model: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    temperature: 0.7,
    top_k: 4,
    max_tokens: 50,
    top_logprobs: 4,
  };

  export const AVAILABLE_MODELS = [
    "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    "Phi-3-mini-4k-instruct-q4f16_1-MLC",
    "Gemma-2-2b-it-q4f16_1-MLC",
  ];
  ```

- [ ] Create LLM loading component (`src/components/LLMLoader.svelte`):
  ```svelte
  <script>
    // Learn: Async operations in Svelte, loading states
    import { WebLLMBackend } from '$lib/llm/webllm-backend';

    let backend = $state(null);
    let loadingProgress = $state(0);
    let status = $state('initializing');

    async function loadModel() {
      const llm = new WebLLMBackend();
      await llm.initialize((progress) => {
        loadingProgress = progress.progress;
      });
      backend = llm;
      status = 'ready';
    }
  </script>

  {#if status === 'initializing'}
    <div class="loading">
      Loading model... {Math.round(loadingProgress * 100)}%
    </div>
  {:else if status === 'ready'}
    <slot {backend} />
  {/if}
  ```

- [ ] Test WebLLM integration:
  - Create a simple test component that generates tokens
  - Verify logprobs are returned correctly
  - Test with different prompts and parameters
  - Handle errors (model not found, WebGPU not supported)

- [ ] Add WebGPU detection:
  ```typescript
  export function checkWebGPUSupport(): boolean {
    return navigator.gpu !== undefined;
  }

  export async function getGPUInfo(): Promise<string> {
    const adapter = await navigator.gpu.requestAdapter();
    return adapter?.info.description || 'Unknown';
  }
  ```

## Acceptance Criteria

- [ ] LLMBackend interface defines clear contract
- [ ] WebLLMBackend successfully loads model in browser
- [ ] Token generation returns properly structured TokenData array
- [ ] Logprobs are correctly extracted and converted to probabilities
- [ ] LLMLoader component shows loading progress
- [ ] Error handling works for missing WebGPU, model load failures
- [ ] Test component demonstrates token generation

## Tutorial Notes

**What you'll learn:**
- TypeScript interfaces for defining contracts
- WebLLM API for browser-based LLM inference
- Async/await patterns in JavaScript/TypeScript
- Loading states and progress callbacks in Svelte
- Error handling for async operations
- WebGPU detection and compatibility

**Key WebLLM concepts:**
- Models are loaded asynchronously and cached in browser
- First load downloads 1-4GB (subsequent loads use cache)
- `logprobs: true` enables probability information
- `top_logprobs: N` returns top N alternative tokens
- WebLLM uses OpenAI-compatible API

**Key concepts:**
- Interface-based design enables swapping implementations
- Async operations need loading states in UI
- Error handling is critical for browser-based inference
- Progress callbacks improve UX during model loading

**Resources:**
- [WebLLM Documentation](https://webllm.mlc.ai/docs/)
- [WebLLM GitHub](https://github.com/mlc-ai/web-llm)
- [WebGPU Support](https://caniuse.com/webgpu)

## Related Issues

- #1: Project structure
- #3: Token data structures and game state
- #7: Branch continuation logic

## Future Work

- Implement `ServerBackend` for server-hosted LLM
- Implement `CloudBackend` for OpenAI/Anthropic APIs
- Add streaming token generation for real-time visualization
- Use Web Workers to keep UI responsive during generation