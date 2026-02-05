# Issue 2: Implement LLM abstraction layer and Ollama integration

## Description

Create an abstraction layer for LLM backends that separates game logic from LLM implementation. This enables future support for cloud APIs, WebLLM, or server-hosted LLMs. Implement the Ollama backend as the first concrete implementation.

## Tasks

- [ ] Create `LLMBackend` base class (`llm/llm_backend.gd`):
  - Abstract method: `generate_tokens(prompt: String, params: Dictionary) -> Array`
  - Abstract method: `get_available_models() -> Array`
  - Signal: `generation_started`, `generation_completed`, `generation_error`
  - Common parameter validation

- [ ] Create `OllamaBackend` implementation (`llm/ollama_backend.gd`):
  - HTTP client for Ollama API (localhost:11434)
  - `generate_tokens()` implementation:
    - POST to `/api/generate` with prompt, model, temperature, top_k, num_predict
    - Parse response to extract tokens with logprobs
    - Convert logprobs to probabilities
    - Return array of token objects with text, probability, alternatives
  - `get_available_models()` implementation:
    - GET to `/api/tags`
    - Return list of available models
  - Error handling for connection failures, API errors

- [ ] Define token data structure:
  ```gdscript
  class TokenData:
      var text: String
      var probability: float  # 0.0 to 1.0
      var logprob: float
      var is_main_path: bool
      var alternatives: Array[TokenData]  # Alternative tokens at this position
      var position: int  # Index in sequence
  ```

- [ ] Create `LLMConfig` resource (`resources/llm_config.tres`):
  - Default model (e.g., "llama3.2:1b" or "gemma2:2b")
  - Default parameters: temperature (0.7), top_k (4), max_tokens (50)
  - Ollama endpoint URL (configurable)

- [ ] Integrate with GameManager:
  - Add LLM backend instance
  - Expose methods for token generation
  - Connect signals to update UI

## Acceptance Criteria

- [ ] LLMBackend base class defines clear interface
- [ ] OllamaBackend successfully connects to localhost:11434
- [ ] Token generation returns properly structured TokenData array
- [ ] Probabilities are correctly calculated from logprobs
- [ ] Error handling works for missing Ollama, invalid model, etc.
- [ ] GameManager can trigger token generation and receive results

## Notes

- Use Godot's HTTPRequest class for API calls
- Support streaming responses for better UX (future enhancement)
- Token structure should match POC design for compatibility
- Keep backend interface simple to enable future implementations

## API Reference

Ollama Generate API:
```
POST /api/generate
{
  "model": "llama3.2",
  "prompt": "Once upon a time",
  "stream": false,
  "options": {
    "temperature": 0.7,
    "num_predict": 50,
    "top_k": 4
  }
}
```

Response includes:
- `response`: Generated text
- `prompt_eval_count`: Tokens in prompt
- `eval_count`: Tokens generated
- `eval_duration`: Generation time
- `prompt_eval_duration`: Prompt processing time

Note: Need to verify if Ollama returns logprobs/probabilities for alternatives. May need to use `num_ctx` and other options to get full probability distributions.

## Related Issues

- #1: Project structure
- #3: Token data structures
- #7: Branch continuation logic

## Future Work

- Implement `CloudBackend` for OpenAI/Anthropic APIs
- Implement `WebLLMBackend` for browser-based inference
- Add streaming token generation for real-time visualization
- Cache generated tokens to reduce API calls
