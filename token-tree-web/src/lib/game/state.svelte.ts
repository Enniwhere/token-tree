import type { TokenNode } from '../llm/backend';

export class GameState {

    root: TokenNode | null = $state(null);

    selectedNode: TokenNode | null = $state(null);

    nodes: TokenNode[] = $state([]);

    score: number = $state(0);

    targetSubstring: string = $state('');


}

