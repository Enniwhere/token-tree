/**
 * Token generation parameters
 */
export interface GenerationParams {
    node: TokenNode;
    maxTokens: number;
    temperature: number;
    topK: number;
    topP: number;
}

/**
 * Data for a single token
 */
export interface TokenNode {
    id: string;
    prompt: string;
    token: string;
    probability: number;
    root: boolean;
    children: TokenNode[];
}

/**
 * Result of a generation request
 */
export interface GenerationResult {
    nodes: TokenNode[];
}

/**
 * Progress updates during model loading
 */
export interface LoadProgress {
    progress: number; // 0 to 1
    text: string;    
}

/**
 * Interface for the LLM backends
 */
export interface LLMBackend {
    loadModel(onProgress?: (progress: LoadProgress) => void): Promise<void>;
    
    isModelLoaded(): boolean;

    generate(params: GenerationParams): Promise<GenerationResult>;

    unloadModel(): Promise<void>;
}