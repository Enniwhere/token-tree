import type { TokenNode as TokenNodeType } from '../llm/backend';
import { GameState } from './state.svelte';

export function createGameState() {
    const state = new GameState();

    function setRoot(root: TokenNodeType) {
        state.root = root;
        state.nodes = [root];
        state.selectedNode = root;
    }

    function selectNode(node: TokenNodeType) {
        state.selectedNode = node;
    }

    function revealChildren(parent: TokenNodeType, children: TokenNodeType[]) {
        // Idempotent: if already revealed, return existing children
        if (parent.children.length > 0) {
            return parent.children;
        }
        
        // First time revealing - add the children
        parent.children = children;
        state.nodes.push(...children);
        return children;
    }

    function isRevealed(node: TokenNodeType): boolean {
        return state.nodes.includes(node);
    }

    function reset() {
        state.root = null;
        state.selectedNode = null;
        state.nodes = [];
        state.score = 0;
        state.targetSubstring = '';
    }

    return {
        state,
        setRoot,
        selectNode,
        revealChildren,
        reset
    };
}