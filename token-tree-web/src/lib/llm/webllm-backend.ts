import * as webllm from '@mlc-ai/web-llm';
import type {
    LLMBackend,
    GenerationParams,
    GenerationResult,
    TokenNode as TokenNodeType,
    LoadProgress,
} from './backend';
import { WEBLLM_CONFIG, DEFAULT_MODEL } from './config';

/**
 * WebLLM backend implementation
 */
export class WebLLMBackend implements LLMBackend {
    private engine: webllm.MLCEngine | null = null;
    private modelLoaded: boolean = false;

    constructor(private modelId: string = DEFAULT_MODEL) {}
    
    async loadModel(onProgress?: (progress: LoadProgress) => void): Promise<void> {
        if (this.modelLoaded && this.engine) return;

        const initProgressCallback = (report: webllm.InitProgressReport) => {
            if (onProgress) {
                onProgress({
                    progress: report.progress,
                    text: report.text,
                });
            }
        };

        this.engine = await webllm.CreateMLCEngine(
            this.modelId,
            {
                initProgressCallback,
                ...WEBLLM_CONFIG,
            }
        );

        this.modelLoaded = true;

    }

    isModelLoaded(): boolean {
        return this.modelLoaded && this.engine !== null;
    }

    async generate(params: GenerationParams): Promise<GenerationResult> {
        if (!this.isModelLoaded() || !this.engine) {
            throw new Error('Model not loaded. Call loadModel() first.');
        }

        const messages = [
            {role: 'user' as const, content: params.node.prompt},
        ];

        const response = await this.engine.chat.completions.create({
            messages,
            max_tokens: params.maxTokens,
            temperature: params.temperature,
            top_p: params.topP,
            logprobs: true,
            top_logprobs: params.topK,
        });

        return this.transformResponse(response, params.node);
    }

    async unloadModel(): Promise<void> {
    if (this.engine) {
      await this.engine.unload();
      this.engine = null;
      this.modelLoaded = false;
    }
  }
    
    private transformResponse(response: webllm.ChatCompletion, node: TokenNodeType): GenerationResult {
        const nodes: TokenNodeType[] = [];

        const logprobs = response.choices[0]?.logprobs?.content;
        

        var parentNode: TokenNodeType = node;
        nodes.push(parentNode);
        var currentPrompt = node.prompt + node.token;
        if (logprobs && Array.isArray(logprobs)) {
            logprobs.forEach((tokenLogprobs) => {
                const currentToken = tokenLogprobs.token;
                const currentLogprob = tokenLogprobs.logprob || 0;
                const currentProbability = Math.exp(currentLogprob);

                var currentNode: TokenNodeType = {
                    id: crypto.randomUUID(),
                    prompt: currentPrompt,
                    token: currentToken,
                    probability: currentProbability,
                    cumprob: parentNode.cumprob * currentProbability,
                    root: false,
                    children: [],
                };
                parentNode.children.push(currentNode);
                
                if (tokenLogprobs.top_logprobs && Array.isArray(tokenLogprobs.top_logprobs)) {
                    
                    const sortedTopLogprobs = tokenLogprobs.top_logprobs.sort((a, b) => b.logprob - a.logprob);
                    sortedTopLogprobs.forEach((alt: { token: string; logprob: number; }) => {

                        const altLogprob = alt.logprob || 0;
                        const altProbability = Math.exp(altLogprob);
                        const altNode: TokenNodeType = {
                            id: crypto.randomUUID(),
                            prompt: currentPrompt,
                            token: alt.token,
                            probability: altProbability,
                            cumprob: parentNode.cumprob * altProbability,
                            root: false,
                            children: [],
                        };

                        parentNode.children.push(altNode);
                        nodes.push(altNode);
                    });
                }
                currentPrompt += currentToken;
                parentNode = currentNode;
            });
        };

        return {
            nodes
        };
    }
}




