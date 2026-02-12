# Step 2: LLM Abstraction

**Learn:** WebLLM, async/await, TypeScript interfaces

## Concepts
- **WebLLM**: Browser-based LLM inference using WebGPU
- **Async/await**: Handle asynchronous operations like model loading
- **TypeScript interfaces**: Define contracts for LLM backends

## Actions
- [ ] Create `src/lib/llm/backend.ts` with interfaces for GenerationParams, TokenData, and LLMBackend
- [ ] Create `src/lib/llm/webllm-backend.ts` implementing LLMBackend with WebLLM
- [ ] Create `src/lib/llm/config.ts` with default config and available models
- [ ] Install WebLLM: `npm install @mlc-ai/web-llm`
- [ ] Create `LLMLoader.svelte` component for model loading with progress display
- [ ] Test model loading in browser

## Verify
- [ ] WebLLM model loads and shows progress

## Resources
- WebLLM docs: https://webllm.mlc.ai/docs/
- TypeScript interfaces: https://www.typescriptlang.org/docs/handbook/interfaces.html