// Token Tree Visualization - Main Script

// Global state for branch management
const state = {
    baseTokens: [], // Original token sequence from generation
    activeBranches: [], // Array of active branch paths
    branchContinuations: new Map() // Map of branch key -> continuation tokens
};

// Configuration
const config = {
    nodeHeight: 40,
    wordSpacing: 15,
    verticalSpacing: 80,
    startX: 50,
    startY: 400,
    padding: 100,
    minLineThickness: 8,
    maxLineThickness: 60,
    fontSize: 18,
    altFontSize: 14,
    altNodePadding: 8,
    // LLM Configuration
    ollamaUrl: 'http://localhost:11434/api/generate',
    modelName: 'gemma3:1b',
    minAlternativeProbability: 0.05, // 5% threshold for showing alternatives
    maxTopLogprobs: 4 // Number of alternative tokens to request
};

// Initialize the visualization
function init() {
    setupEventHandlers();
}

// Set up event handlers
function setupEventHandlers() {
    // Generate button
    document.getElementById('generateBtn').addEventListener('click', handleGenerate);
    
    // Mock data button
    document.getElementById('mockDataBtn').addEventListener('click', loadMockData);
    
    // Example buttons
    document.querySelectorAll('.example-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.getElementById('promptInput').value = e.target.dataset.prompt;
        });
    });
    
    // Enter key in prompt input (with Ctrl/Cmd)
    document.getElementById('promptInput').addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            handleGenerate();
        }
    });
}

// Load mock data
function loadMockData() {
    document.getElementById('promptText').textContent = mockData.prompt;
    state.baseTokens = mockData.tokens;
    state.activeBranches = [];
    state.branchContinuations.clear();
    renderTree(mockData.tokens);
    hideError();
}

// Calculate cumulative probability for a path
function calculateCumulativeProbability(tokens, index) {
    let cumProb = 1.0;
    for (let i = 0; i <= index; i++) {
        cumProb *= tokens[i].probability;
    }
    return cumProb;
}

// Render the complete tree
function renderTree(tokens) {
    const svg = document.getElementById('treeSvg');
    
    // Build tree structure including all active branches
    const treeData = buildTreeStructure(tokens);
    const dimensions = calculateTreeDimensions(treeData);
    
    // Set SVG dimensions to accommodate the entire tree
    svg.setAttribute('width', dimensions.width);
    svg.setAttribute('height', dimensions.height);
    
    // Clear existing content
    svg.innerHTML = '';
    
    // Render alternative connections first (behind everything)
    renderAlternativeConnections(svg, treeData);
    
    // Render main path (on top of alternative connections)
    renderMainPath(svg, treeData);
    
    // Render active branch paths
    renderActiveBranches(svg, treeData);
    
    // Render nodes (on top of everything)
    renderNodes(svg, treeData);
}

// Build tree structure with positions
function buildTreeStructure(tokens) {
    const tree = [];
    const mainY = config.startY;
    let currentX = config.startX;
    
    // Create temporary SVG text element for measuring
    const svg = document.getElementById('treeSvg');
    const tempText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    tempText.setAttribute('font-size', config.fontSize);
    tempText.setAttribute('font-weight', '400');
    svg.appendChild(tempText);
    
    // Build main path nodes
    tokens.forEach((token, index) => {
        const cumProb = calculateCumulativeProbability(tokens, index);
        
        // Measure actual text width
        tempText.textContent = token.text;
        const textWidth = tempText.getBBox().width;
        
        // Main path node
        const mainNode = {
            text: token.text,
            x: currentX,
            y: mainY,
            width: textWidth,
            probability: token.probability,
            cumulativeProbability: cumProb,
            isMainPath: true,
            tokenIndex: index,
            branchIndex: 0,
            branchId: null // Main path has no branch ID
        };
        
        tree.push(mainNode);
        
        // Alternative nodes - initial positioning
        if (token.alternatives && token.alternatives.length > 0) {
            token.alternatives.forEach((alt, altIndex) => {
                const altCumProb = (index > 0 ? calculateCumulativeProbability(tokens, index - 1) : 1.0) * alt.probability;
                
                // Measure alternative text width
                tempText.setAttribute('font-size', config.altFontSize);
                tempText.textContent = alt.text;
                const altTextWidth = tempText.getBBox().width;
                tempText.setAttribute('font-size', config.fontSize);
                
                // Create branch ID for this alternative
                const branchId = `${index}-${altIndex}`;
                
                // Check if this branch is active
                const isActive = state.activeBranches.some(b => b.branchId === branchId);
                
                // Initial Y position (will be relaxed later)
                const altNode = {
                    text: alt.text,
                    x: currentX,
                    y: mainY, // Start at main path, will be moved
                    width: altTextWidth,
                    probability: alt.probability,
                    cumulativeProbability: altCumProb,
                    isMainPath: false,
                    isActiveBranch: isActive,
                    tokenIndex: index,
                    branchIndex: altIndex + 1,
                    branchId: branchId,
                    parentNode: mainNode
                };
                
                tree.push(altNode);
            });
        }
        
        // Move X position for next word
        currentX += textWidth + config.wordSpacing;
    });
    
    // Add branch continuations for active branches
    state.activeBranches.forEach(branch => {
        const continuation = state.branchContinuations.get(branch.branchId);
        if (continuation && continuation.length > 0) {
            const branchStartNode = tree.find(n => n.branchId === branch.branchId);
            if (branchStartNode) {
                addBranchContinuation(tree, tempText, branchStartNode, continuation, branch.branchId);
            }
        }
    });
    
    // Remove temporary text element
    svg.removeChild(tempText);
    
    // Apply relaxation to position alternatives
    relaxAlternativePositions(tree);
    
    return tree;
}

// Add continuation tokens for an active branch
function addBranchContinuation(tree, tempText, startNode, continuationTokens, branchId) {
    let currentX = startNode.x + startNode.width + config.wordSpacing;
    const branchY = startNode.y;
    
    continuationTokens.forEach((token, index) => {
        // Measure text width
        tempText.textContent = token.text;
        const textWidth = tempText.getBBox().width;
        
        // Calculate cumulative probability for this branch path
        const cumProb = startNode.cumulativeProbability * calculateCumulativeProbability(continuationTokens, index);
        
        const branchNode = {
            text: token.text,
            x: currentX,
            y: branchY,
            width: textWidth,
            probability: token.probability,
            cumulativeProbability: cumProb,
            isMainPath: false,
            isActiveBranch: true,
            isBranchContinuation: true,
            tokenIndex: startNode.tokenIndex + index + 1,
            branchIndex: startNode.branchIndex,
            branchId: branchId,
            parentBranchId: branchId
        };
        
        tree.push(branchNode);
        currentX += textWidth + config.wordSpacing;
    });
}

// Relaxation algorithm to position alternatives avoiding overlaps
function relaxAlternativePositions(tree) {
    const mainY = config.startY;
    const targetDistance = config.verticalSpacing * 0.55; // Target distance from main branch
    const minDistance = config.verticalSpacing * 0.45; // Minimum distance between nodes
    const iterations = 200;
    const damping = 0.5;
    
    // Get all alternatives grouped by token index
    const alternativesByToken = {};
    tree.forEach(node => {
        if (!node.isMainPath) {
            if (!alternativesByToken[node.tokenIndex]) {
                alternativesByToken[node.tokenIndex] = [];
            }
            alternativesByToken[node.tokenIndex].push(node);
        }
    });
    
    // Initialize positions - spread alternatives above and below
    Object.values(alternativesByToken).forEach(alts => {
        alts.forEach((alt, idx) => {
            // Start with alternating pattern
            const direction = idx % 2 === 0 ? -1 : 1;
            const offset = Math.floor(idx / 2) + 1;
            alt.y = mainY + (direction * offset * config.verticalSpacing);
        });
    });
    
    // Relaxation iterations
    for (let iter = 0; iter < iterations; iter++) {
        const forces = new Map();
        
        tree.forEach(node => {
            if (!node.isMainPath) {
                forces.set(node, 0);
            }
        });
        
        // Calculate forces for each alternative
        tree.forEach(node => {
            if (!node.isMainPath) {
                let force = 0;
                
                // Spring force to maintain target distance from main path
                const distToMain = Math.abs(node.y - mainY);
                const targetForce = (distToMain - targetDistance) * -0.2;
                force += node.y > mainY ? targetForce : -targetForce;
                
                // Strong repulsion if too close to main path
                if (distToMain < minDistance) {
                    const mainForce = (minDistance - distToMain) * 1.5;
                    force += node.y > mainY ? mainForce : -mainForce;
                }
                
                // Force away from other alternatives at same token position
                const sameTokenAlts = alternativesByToken[node.tokenIndex] || [];
                sameTokenAlts.forEach(other => {
                    if (other !== node) {
                        const dist = Math.abs(node.y - other.y);
                        if (dist < minDistance * 1.5) {
                            const repulsion = (minDistance * 1.5 - dist) * 0.8;
                            force += node.y > other.y ? repulsion : -repulsion;
                        }
                    }
                });
                
                // Force away from alternatives at adjacent token positions
                const adjacentTokens = [node.tokenIndex - 1, node.tokenIndex + 1];
                adjacentTokens.forEach(adjIdx => {
                    const adjAlts = alternativesByToken[adjIdx] || [];
                    adjAlts.forEach(other => {
                        const dist = Math.abs(node.y - other.y);
                        const xDist = Math.abs(node.x - other.x);
                        // Stronger repulsion if horizontally close
                        if (xDist < config.wordSpacing * 3 && dist < minDistance) {
                            const repulsion = (minDistance - dist) * 0.7;
                            force += node.y > other.y ? repulsion : -repulsion;
                        } else if (dist < minDistance * 0.8) {
                            const repulsion = (minDistance * 0.8 - dist) * 0.4;
                            force += node.y > other.y ? repulsion : -repulsion;
                        }
                    });
                });
                
                force *= damping;
                
                forces.set(node, force);
            }
        });
        
        // Apply forces
        forces.forEach((force, node) => {
            node.y += force;
        });
    }
}

// Calculate total dimensions needed for the tree
function calculateTreeDimensions(treeData) {
    let minX = Infinity;
    let maxX = 0;
    let minY = Infinity;
    let maxY = 0;
    
    treeData.forEach(node => {
        minX = Math.min(minX, node.x);
        maxX = Math.max(maxX, node.x + node.width);
        minY = Math.min(minY, node.y);
        maxY = Math.max(maxY, node.y + config.nodeHeight);
    });
    
    return {
        width: maxX + config.padding * 2,
        height: (maxY - minY) + config.padding * 4
    };
}

// Render alternative branch connections (first layer)
function renderAlternativeConnections(svg, treeData) {
    const mainPathNodes = treeData.filter(n => n.isMainPath);
    const altNodes = treeData.filter(n => !n.isMainPath);
    
    altNodes.forEach(altNode => {
        if (altNode.parentNode) {
            // Find the previous main path node to connect from
            const prevMainNode = mainPathNodes.find(n => n.tokenIndex === altNode.tokenIndex - 1);
            if (prevMainNode) {
                drawConnection(svg, prevMainNode, altNode, false);
            }
        }
    });
}

// Render main path (second layer)
function renderMainPath(svg, treeData) {
    const mainPathNodes = treeData.filter(n => n.isMainPath);
    drawContinuousMainPath(svg, mainPathNodes, '#4a90e2', 1.0);
}

// Render active branch paths (third layer)
function renderActiveBranches(svg, treeData) {
    // Group branch continuation nodes by their branch ID
    const branchGroups = new Map();
    
    treeData.forEach(node => {
        if (node.isActiveBranch && node.isBranchContinuation) {
            if (!branchGroups.has(node.branchId)) {
                branchGroups.set(node.branchId, []);
            }
            branchGroups.get(node.branchId).push(node);
        }
    });
    
    // Draw each branch path
    const branchColors = ['#e74c3c', '#9b59b6', '#f39c12', '#27ae60', '#e67e22'];
    let colorIndex = 0;
    
    branchGroups.forEach((nodes, branchId) => {
        if (nodes.length > 0) {
            // Sort by token index to ensure correct order
            nodes.sort((a, b) => a.tokenIndex - b.tokenIndex);
            
            // Find the branch start node (the alternative that was clicked)
            const branchStart = treeData.find(n => n.branchId === branchId && !n.isBranchContinuation);
            
            if (branchStart) {
                // Include the branch start node
                const fullPath = [branchStart, ...nodes];
                const color = branchColors[colorIndex % branchColors.length];
                colorIndex++;
                
                drawContinuousMainPath(svg, fullPath, color, 0.85);
            }
        }
    });
}

// Draw continuous main path as a single shape with varying width
function drawContinuousMainPath(svg, pathNodes, color = '#4a90e2', opacity = 1.0) {
    if (pathNodes.length < 2) return;
    
    // Use the Y position of the first node (supports branches at different Y levels)
    const y = pathNodes[0].y;
    
    // Define control points at word centers with their thickness
    const controlPoints = [];
    pathNodes.forEach((node, i) => {
        const thickness = config.minLineThickness + (node.cumulativeProbability * (config.maxLineThickness - config.minLineThickness));
        
        controlPoints.push({
            x: node.x + node.width / 2,
            thickness: thickness
        });
    });
    
    // Extend start and end
    const firstNode = pathNodes[0];
    const lastNode = pathNodes[pathNodes.length - 1];
    const startX = firstNode.x - config.wordSpacing;
    const endX = lastNode.x + lastNode.width + config.wordSpacing;
    
    // Sample many points along the entire path for smooth interpolation
    const numSamples = 200;
    const samples = [];
    
    for (let i = 0; i <= numSamples; i++) {
        const t = i / numSamples;
        const x = startX + (endX - startX) * t;
        
        // Interpolate thickness at this x position
        let thickness;
        
        if (x < controlPoints[0].x) {
            // Before first word - use first word's thickness
            thickness = controlPoints[0].thickness;
        } else if (x > controlPoints[controlPoints.length - 1].x) {
            // After last word - use last word's thickness
            thickness = controlPoints[controlPoints.length - 1].thickness;
        } else {
            // Find the two control points to interpolate between
            let idx = 0;
            for (let j = 0; j < controlPoints.length - 1; j++) {
                if (x >= controlPoints[j].x && x <= controlPoints[j + 1].x) {
                    idx = j;
                    break;
                }
            }
            
            const p1 = controlPoints[idx];
            const p2 = controlPoints[idx + 1];
            const localT = (x - p1.x) / (p2.x - p1.x);
            
            // Smooth interpolation using ease-in-out
            const smoothT = localT * localT * (3 - 2 * localT);
            thickness = p1.thickness + (p2.thickness - p1.thickness) * smoothT;
        }
        
        samples.push({
            x: x,
            thickness: thickness
        });
    }
    
    // Create top and bottom edges from samples
    const topPath = [];
    const bottomPath = [];
    
    for (let i = 0; i < samples.length; i++) {
        const sample = samples[i];
        const halfThickness = sample.thickness / 2;
        
        topPath.push({ x: sample.x, y: y - halfThickness });
        bottomPath.push({ x: sample.x, y: y + halfThickness });
    }
    
    // Build smooth path
    let pathData = `M ${topPath[0].x} ${topPath[0].y}`;
    
    // Top edge
    for (let i = 1; i < topPath.length; i++) {
        pathData += ` L ${topPath[i].x} ${topPath[i].y}`;
    }
    
    // Bottom edge (reversed)
    for (let i = bottomPath.length - 1; i >= 0; i--) {
        pathData += ` L ${bottomPath[i].x} ${bottomPath[i].y}`;
    }
    
    pathData += ' Z'; // Close the path
    
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', pathData);
    path.classList.add('main-path-shape');
    path.style.fill = color;
    path.style.opacity = opacity;
    
    svg.appendChild(path);
}

// Draw a single connection line (for alternatives only now)
function drawConnection(svg, fromNode, toNode, isMainPath) {
    const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    
    // For alternatives, connect from center of main node to center of alternative
    const startX = fromNode.x + fromNode.width / 2;
    const startY = fromNode.y;
    const endX = toNode.x + toNode.width / 2;
    const endY = toNode.y;
    
    // Create a smooth curve
    const midX = (startX + endX) / 2;
    const pathData = `M ${startX} ${startY} C ${midX} ${startY}, ${midX} ${endY}, ${endX} ${endY}`;
    
    line.setAttribute('d', pathData);
    line.classList.add('connection-line');
    line.classList.add('alternative');
    
    // Thickness based on cumulative probability for alternatives
    const thickness = config.minLineThickness + (toNode.cumulativeProbability * (config.maxLineThickness - config.minLineThickness));
    line.style.strokeWidth = thickness;
    
    // Use same color as main branch but more transparent
    line.style.stroke = '#4a90e2';
    line.style.opacity = '0.15';
    
    svg.appendChild(line);
}

// Render all nodes
function renderNodes(svg, treeData) {
    treeData.forEach(node => {
        drawNode(svg, node);
    });
}

// Draw a single node
function drawNode(svg, node) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.classList.add('token-node');
    
    if (node.isMainPath) {
        group.classList.add('main-path');
    } else if (node.isActiveBranch) {
        group.classList.add('active-branch');
        if (node.isBranchContinuation) {
            group.classList.add('branch-continuation');
        }
    } else {
        group.classList.add('alternative');
    }
    
    // Create subtle background for alternative and branch nodes
    if (!node.isMainPath) {
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        const padding = config.altNodePadding;
        const fontSize = node.isBranchContinuation ? config.fontSize : config.altFontSize;
        rect.setAttribute('x', node.x - padding);
        rect.setAttribute('y', node.y - fontSize / 2 - padding / 2);
        rect.setAttribute('width', node.width + padding * 2);
        rect.setAttribute('height', fontSize + padding);
        rect.setAttribute('rx', 3);
        group.appendChild(rect);
    }
    
    // Create text
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    
    if (node.isMainPath || node.isBranchContinuation) {
        // For main path and branch continuations, left-align text to flow naturally
        text.setAttribute('x', node.x);
        text.setAttribute('y', node.y);
        text.setAttribute('text-anchor', 'start');
        text.setAttribute('font-size', config.fontSize);
    } else {
        // For alternatives, center text
        text.setAttribute('x', node.x + node.width / 2);
        text.setAttribute('y', node.y);
        text.setAttribute('text-anchor', 'middle');
        text.setAttribute('font-size', config.altFontSize);
    }
    
    text.setAttribute('dominant-baseline', 'middle');
    text.textContent = node.text;
    
    group.appendChild(text);
    
    // Add click handler for alternatives that aren't already active
    if (!node.isMainPath && !node.isActiveBranch && !node.isBranchContinuation && node.branchId) {
        group.style.cursor = 'pointer';
        group.addEventListener('click', () => handleAlternativeClick(node));
    }
    
    svg.appendChild(group);
}

// Handle clicking on an alternative token
function handleAlternativeClick(node) {
    console.log('Alternative clicked:', node);
    
    // Check if this branch is already active
    if (state.activeBranches.some(b => b.branchId === node.branchId)) {
        return; // Already active, do nothing
    }
    
    // Add to active branches
    state.activeBranches.push({
        branchId: node.branchId,
        tokenIndex: node.tokenIndex,
        text: node.text
    });
    
    // Generate continuation for this branch
    generateBranchContinuation(node);
    
    // Re-render the tree
    renderTree(state.baseTokens);
}

// Generate continuation tokens for a branch
function generateBranchContinuation(branchNode) {
    // For now, use mock continuation data
    // In a real implementation, this would call the LLM API
    const mockContinuations = [
        // Continuation for "a" instead of "there"
        [
            { text: "magical", probability: 0.7, alternatives: [] },
            { text: "kingdom", probability: 0.8, alternatives: [] },
            { text: "awaited", probability: 0.6, alternatives: [] },
            { text: "discovery", probability: 0.75, alternatives: [] }
        ],
        // Continuation for "in" instead of "there"
        [
            { text: "ancient", probability: 0.65, alternatives: [] },
            { text: "times", probability: 0.85, alternatives: [] },
            { text: "long", probability: 0.7, alternatives: [] },
            { text: "forgotten", probability: 0.6, alternatives: [] }
        ],
        // Continuation for "an" instead of "a"
        [
            { text: "enchanted", probability: 0.8, alternatives: [] },
            { text: "forest", probability: 0.75, alternatives: [] },
            { text: "where", probability: 0.85, alternatives: [] },
            { text: "magic", probability: 0.7, alternatives: [] }
        ],
        // Continuation for "little" instead of "young"
        [
            { text: "girl", probability: 0.9, alternatives: [] },
            { text: "with", probability: 0.85, alternatives: [] },
            { text: "golden", probability: 0.7, alternatives: [] },
            { text: "hair", probability: 0.8, alternatives: [] }
        ],
        // Continuation for "palace" instead of "castle"
        [
            { text: "made", probability: 0.75, alternatives: [] },
            { text: "of", probability: 0.95, alternatives: [] },
            { text: "crystal", probability: 0.7, alternatives: [] },
            { text: "and", probability: 0.85, alternatives: [] },
            { text: "gold", probability: 0.8, alternatives: [] }
        ]
    ];
    
    // Select a random continuation (in real implementation, this would be based on the actual alternative)
    const continuation = mockContinuations[Math.floor(Math.random() * mockContinuations.length)];
    
    // Store the continuation
    state.branchContinuations.set(branchNode.branchId, continuation);
}

// Handle generate button click
async function handleGenerate() {
    const promptInput = document.getElementById('promptInput');
    const maxTokensInput = document.getElementById('maxTokens');
    const temperatureInput = document.getElementById('temperature');
    const topLogprobsInput = document.getElementById('topLogprobs');
    const minProbabilityInput = document.getElementById('minProbability');
    
    const prompt = promptInput.value.trim();
    const maxTokens = parseInt(maxTokensInput.value);
    const temperature = parseFloat(temperatureInput.value);
    const topLogprobs = parseInt(topLogprobsInput.value);
    const minProbability = parseFloat(minProbabilityInput.value) / 100; // Convert percentage to decimal
    
    // Validation
    if (!prompt) {
        showError('Please enter a prompt');
        return;
    }
    
    if (maxTokens < 1 || maxTokens > 200) {
        showError('Max tokens must be between 1 and 200');
        return;
    }
    
    // Update UI state
    document.getElementById('promptText').textContent = prompt;
    showLoading();
    hideError();
    disableInputs();
    
    // Update config with user settings
    config.minAlternativeProbability = minProbability;
    
    try {
        const tokens = await generateFromOllama(prompt, maxTokens, temperature, topLogprobs);
        state.baseTokens = tokens;
        state.activeBranches = [];
        state.branchContinuations.clear();
        renderTree(tokens);
    } catch (error) {
        showError(error.message);
        console.error('Generation error:', error);
    } finally {
        hideLoading();
        enableInputs();
    }
}

// Generate tokens from Ollama (non-streaming)
async function generateFromOllama(prompt, maxTokens, temperature, topLogprobs) {
    const response = await fetch(config.ollamaUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            model: config.modelName,
            prompt: prompt,
            stream: false,
            logprobs: true,
            top_logprobs: topLogprobs,
            options: {
                num_predict: maxTokens,
                temperature: temperature,
            },
        })
    });
    
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}\n${errorText}`);
    }
    
    const data = await response.json();
    
    // Transform the response to our token format
    return transformOllamaResponse(data);
}

// Transform Ollama response to our token format
function transformOllamaResponse(data) {
    if (!data.logprobs || !Array.isArray(data.logprobs)) {
        throw new Error('No logprobs in response. Make sure your Ollama version supports logprobs.');
    }
    
    const tokens = [];
    
    data.logprobs.forEach(tokenData => {
        // Main token (the one that was actually selected)
        const mainToken = tokenData.token;
        const mainLogprob = tokenData.logprob;
        const mainProbability = Math.exp(mainLogprob);
        
        // Extract alternatives from top_logprobs
        const alternatives = [];
        
        if (tokenData.top_logprobs && Array.isArray(tokenData.top_logprobs)) {
            tokenData.top_logprobs.forEach(altData => {
                // Skip the main token if it appears in alternatives
                if (altData.token === mainToken) {
                    return;
                }
                
                const altProbability = Math.exp(altData.logprob);
                
                // Only include if above threshold
                if (altProbability >= config.minAlternativeProbability) {
                    alternatives.push({
                        text: altData.token,
                        probability: altProbability,
                        isMainPath: false
                    });
                }
            });
        }
        
        // Sort alternatives by probability (highest first)
        alternatives.sort((a, b) => b.probability - a.probability);
        
        tokens.push({
            text: mainToken,
            probability: mainProbability,
            isMainPath: true,
            alternatives: alternatives
        });
    });
    
    return tokens;
}

// UI Helper Functions
function showLoading() {
    document.getElementById('loadingIndicator').style.display = 'flex';
}

function hideLoading() {
    document.getElementById('loadingIndicator').style.display = 'none';
}

function showError(message) {
    const errorEl = document.getElementById('errorMessage');
    errorEl.textContent = message;
    errorEl.style.display = 'block';
}

function hideError() {
    document.getElementById('errorMessage').style.display = 'none';
}

function disableInputs() {
    document.getElementById('generateBtn').disabled = true;
    document.getElementById('promptInput').disabled = true;
    document.getElementById('maxTokens').disabled = true;
    document.querySelectorAll('.example-btn').forEach(btn => btn.disabled = true);
}

function enableInputs() {
    document.getElementById('generateBtn').disabled = false;
    document.getElementById('promptInput').disabled = false;
    document.getElementById('maxTokens').disabled = false;
    document.querySelectorAll('.example-btn').forEach(btn => btn.disabled = false);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', init);
