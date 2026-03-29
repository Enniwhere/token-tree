/**
 * Available WebLLM models
 * See: https://webllm.mlc.ai/docs/
 */
export const AVAILABLE_MODELS = {
  // Small models for quick testing
  'Phi-3.5-mini-instruct-q4f32_1-MLC-1k': {
    name: 'Phi-3.5 Mini',
    description: 'Small, fast model good for testing',
    size: '~2GB',
  },
  'Llama-3.2-1B-Instruct-q4f16_1-MLC': {
    name: 'Llama 3.2 1B',
    description: 'Compact model with good quality',
    size: '~1GB',
  },
  'Gemma-2-2B-it-q4f16_1-MLC': {
    name: 'Gemma 2 2B',
    description: 'Google\'s small model',
    size: '~2GB',
  },
  'SmolLM2-360M-Instruct-q4f32_1-MLC': {
    name: 'SmolLM2 360M',
    description: 'Tiny model for very fast generation',
    size: '~360MB',
  },
} as const;

export type ModelId = keyof typeof AVAILABLE_MODELS;

export const DEFAULT_PARAMS = {
    maxTokens: 50,
    temperature: 0.7,
    topK: 4,
    topP: 0.9,
} as const;

export const DEFAULT_MODEL: ModelId = 'SmolLM2-360M-Instruct-q4f32_1-MLC';

export const WEBLLM_CONFIG = {
    useWebGPU: true, // Whether to use WebGPU if available
    numThreads: navigator.hardwareConcurrency || 4, // Number of threads for WebAssembly
} as const;