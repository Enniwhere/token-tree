import { HangingTreeLayout } from './tree-layout';
import type { TokenNode } from '../../llm/backend';

// Create sample token tree
const createTestTree = (): TokenNode => {
    return {
        id: 'root',
        prompt: 'Hello',
        token: '',
        probability: 1.0,
        root: true,
        children: [
            {
                id: 'main1',
                prompt: 'Hello',
                token: ' world',
                probability: 0.8,
                root: false,
                children: [
                    {
                        id: 'main2',
                        prompt: 'Hello world',
                        token: '!',
                        probability: 0.9,
                        root: false,
                        children: [],
                    },
                ],
            },
            {
                id: 'alt1',
                prompt: 'Hello',
                token: ' there',
                probability: 0.15,
                root: false,
                children: [],
            },
            {
                id: 'alt2',
                prompt: 'Hello',
                token: ' friend',
                probability: 0.05,
                root: false,
                children: [
                    {
                        id: 'alt2_child1',
                        prompt: 'Hello friend',
                        token: '!',
                        probability: 0.5,
                        root: false,
                        children: [
                            {
                                id: 'alt2_child1_child1',
                                prompt: 'Hello friend!',
                                token: '!',
                                probability: 0.5,
                                root: false,
                                children: [],
                            },
                            {
                                id: 'alt2_child1_child2',
                                prompt: 'Hello friend!',
                                token: '?',
                                probability: 0.05,
                                root: false,
                                children: [],
                            }
                        ],
                    }
                ],
            },
        ],
    };
};

// Test the layout
const layout = new HangingTreeLayout();
const tree = createTestTree();
const result = layout.computeLayout(tree);

console.log('=== Layout Result ===');
console.log('\nNode Positions:');
for (const [id, point] of Object.entries(result.nodes)) {
    console.log(`  ${id}: (${point.x}, ${point.y})`);
}

console.log('\nConnections:');
for (const [parentId, childIds] of Object.entries(result.connections)) {
    console.log(`  ${parentId} → [${childIds.join(', ')}]`);
}

// Verify constraints
console.log('\n=== Verification ===');
let hasErrors = false;

// Check root is positioned
if (!result.nodes['root']) {
    console.error('❌ Root node not positioned!');
    hasErrors = true;
} else {
    console.log('✅ Root node positioned');
}

// Check all nodes are positioned
const allNodeIds = ['root', 'main1', 'main2', 'alt1', 'alt2'];
for (const id of allNodeIds) {
    if (!result.nodes[id]) {
        console.error(`❌ Node ${id} not positioned!`);
        hasErrors = true;
    }
}

// Check parent-child Y constraints
if (result.nodes['main1'] && result.nodes['root']) {
    if (result.nodes['main1'].y < result.nodes['root'].y) {
        console.error('❌ main1 is above root!');
        hasErrors = true;
    }
}

if (result.nodes['alt1'] && result.nodes['root']) {
    if (result.nodes['alt1'].y < result.nodes['root'].y) {
        console.error('❌ alt1 is above root!');
        hasErrors = true;
    }
}

if (!hasErrors) {
    console.log('✅ All constraints satisfied');
}