<script lang="ts">
    import type { TokenNode } from "../lib/llm/backend";

    interface Props {
        node: TokenNode;
        isSelected?: boolean;
        onClick?: () => void;
    }

    let { node, isSelected = false, onClick }: Props = $props();
    let isHovered = $state(false);

    const ringCircumference = 2 * Math.PI * 22; 
    const ringDash = $derived(node.probability * ringCircumference);
    const ringGap = $derived(ringCircumference - ringDash);
</script>

<button
    type="button"
    class="token-node"
    class:selected={isSelected}
    class:hovered={isHovered}
    class:root={node.root}
    onclick={() => onClick?.()}
    onmouseenter={() => isHovered = true}
    onmouseleave={() => isHovered = false}
>
    <svg class="probability-ring" viewBox="0 0 50 50">
        <circle
            class="ring-background"
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="#e0e0e0"
            stroke-width="3"
        />
        <circle
            class="ring-foreground"
            cx="25"
            cy="25"
            r="22"
            fill="none"
            stroke="#4a90e2"
            stroke-width="3"
            stroke-dasharray="{ringDash} {ringGap}"
            stroke-linecap="round"
            transform="rotate(-90 25 25)"
        />
    </svg>
    <span class="token-text">{node.token}</span>
</button>

<style>
    .token-node {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;

        background: none;
        border: none;
        padding: 0;
        font: inherit;

        width: 60px;
        height: 60px;
        cursor: pointer;
        transition: transform 0.2s, ease;
    }

    .token-node:hover {
        transform: scale(1.1);
    }

    .token-node.selected {
        transform: scale(1.15);
    }

    .probability-ring {
        position: absolute;
        width: 100%;
        height: 100%;
        transition: stroke 0.3s ease;
    }

    .token-node:hover .probability-ring circle:last-child {
        stroke: #6ba3e8;
    }

    .token-node.selected .probability-ring circle:last-child {
        stroke: #2e6eb8;
        stroke-width: 4;
    }

    .token-text {
        font-size: 12px;
        font-weight: 500;
        z-index: 1;
        max-width: 50px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        text-align: center;
    }

    .token-node.root .token-text {
        font-weight: 700;
    }
</style>