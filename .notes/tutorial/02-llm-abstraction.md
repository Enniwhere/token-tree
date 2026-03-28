# Step 2: LLM Abstraction

**Learn:** WebLLM, async/await, TypeScript interfaces

## Concepts
- **WebLLM**: Browser-based LLM inference using WebGPU
- **Async/await**: Handle asynchronous operations like model loading
- **TypeScript interfaces**: Define contracts for LLM backends

## Actions
- [X] Create `src/lib/llm/backend.ts` with interfaces for GenerationParams, TokenNote, and LLMBackend
- [X] Create `src/lib/llm/webllm-backend.ts` implementing LLMBackend with WebLLM
- [X] Create `src/lib/llm/config.ts` with default config and available models
- [X] Install WebLLM: `npm install @mlc-ai/web-llm`
- [X] Create `LLMLoader.svelte` component for model loading with progress display
- [X] Test model loading in browser

## Verify
- [X] WebLLM model loads and shows progress

## Resources
- WebLLM docs: https://webllm.mlc.ai/docs/
- TypeScript interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html