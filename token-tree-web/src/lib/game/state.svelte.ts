import type { TokenNode as TokenNodeType } from '../llm/backend';

export class GameState {

    root: TokenNodeType | null = $state(null);

    selectedNode: TokenNodeType | null = $state(null);

    nodes: TokenNodeType[] = $state([]);

    score: number = $state(0);

    targetSubstring: string = $state('');


}

