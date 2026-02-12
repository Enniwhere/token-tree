# Issue 10: Deploy and document the game

## Description

Configure deployment for Raspberry Pi hosting, create documentation, and prepare the game for sharing with others. This includes building for production, optimizing assets, and creating user-facing documentation.

**Tutorial Focus**: This issue introduces deployment workflows, build optimization, and documentation practices. You'll learn how to prepare a web application for production deployment.

## Tasks

- [ ] Configure Vite for production build:
  ```typescript
  // vite.config.ts
  import { defineConfig } from 'vite';
  import { svelte } from '@sveltejs/vite-plugin-svelte';

  export default defineConfig({
    plugins: [svelte()],
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'webllm': ['@mlc-ai/web-llm'],
          },
        },
      },
    },
    server: {
      port: 5173,
      host: true,
    },
  });
  ```

- [ ] Create build scripts (`package.json`):
  ```json
  {
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "preview": "vite preview",
      "check": "svelte-check --tsconfig ./tsconfig.json",
      "lint": "eslint . --ext .js,.svelte,.ts",
      "format": "prettier --write ."
    }
  }
  ```

- [ ] Create production build:
  ```bash
  npm run build
  ```

- [ ] Test production build locally:
  ```bash
  npm run preview
  ```

- [ ] Create deployment configuration for Raspberry Pi:
  ```bash
  # deploy.sh
  #!/bin/bash

  # Build the project
  npm run build

  # Copy to Raspberry Pi
  scp -r dist/* user@raspberry-pi:/var/www/token-tree/

  # Restart web server (if needed)
  ssh user@raspberry-pi "sudo systemctl restart nginx"
  ```

- [ ] Create Nginx configuration for Raspberry Pi:
  ```nginx
  # /etc/nginx/sites-available/token-tree
  server {
    listen 80;
    server_name your-domain.com;

    root /var/www/token-tree;
    index index.html;

    # Enable gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
      expires 1y;
      add_header Cache-Control "public, immutable";
    }

    # Serve index.html for all routes (SPA)
    location / {
      try_files $uri $uri/ /index.html;
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
  }
  ```

- [ ] Create README.md:
  ```markdown
  # Token Tree Game

  A web-based game where players explore LLM token generation trees, selecting likely tokens to guide AI responses toward target substrings.

  ## Features

  - Browser-based LLM inference using WebLLM
  - Interactive token tree visualization
  - Branch exploration and continuation
  - Target substring search and scoring
  - Adjustable generation parameters

  ## Getting Started

  ### Prerequisites

  - Modern browser with WebGPU support (Chrome 113+, Edge 113+, Firefox with WebGPU)
  - Node.js 18+ (for development)

  ### Development

  \`\`\`bash
  npm install
  npm run dev
  \`\`\`

  Open http://localhost:5173 in your browser.

  ### Building for Production

  \`\`\`bash
  npm run build
  \`\`\`

  The built files will be in the `dist/` directory.

  ## Usage

  1. Enter a prompt and click "Generate"
  2. Explore the token tree by clicking alternative tokens
  3. Adjust parameters (temperature, top-k) to influence generation
  4. Search for target substrings to earn points
  5. Continue branches to explore different paths

  ## Technical Details

  - **Framework**: Svelte 5
  - **LLM**: WebLLM (browser-based inference)
  - **Rendering**: HTML5 Canvas
  - **Build Tool**: Vite

  ## License

  MIT
  ```

- [ ] Create user guide (`docs/USER_GUIDE.md`):
  ```markdown
  # Token Tree Game - User Guide

  ## Overview

  Token Tree is a game that lets you explore how Large Language Models (LLMs) generate text one token at a time. You'll see the probability distribution for each token and can explore alternative paths through the generation tree.

  ## How to Play

  ### Step 1: Generate Tokens

  1. Enter a prompt in the text box (e.g., "Once upon a time")
  2. Adjust parameters if desired:
     - **Temperature**: Controls randomness (0 = deterministic, 2 = very random)
     - **Top-K**: Number of alternative tokens to consider
     - **Max Tokens**: Maximum tokens to generate
  3. Click "Generate"

  ### Step 2: Explore the Tree

  The main path (blue) shows the most likely sequence of tokens. Alternative tokens (gray) show other possibilities.

  - **Click an alternative token** to create a new branch
  - Branches are colored differently for easy identification
  - Thicker lines indicate higher cumulative probability

  ### Step 3: Continue Branches

  1. Click "Continue" on a branch to generate more tokens
  2. The branch will extend with new tokens
  3. You can have up to 5 active branches

  ### Step 4: Search and Score

  1. Enter a target substring (e.g., "dragon")
  2. Click "Search"
  3. The game will find all occurrences in the tree
  4. Click a result to navigate to that token
  5. Score is based on probability and branch length

  ## Tips

  - Lower temperature = more predictable, higher probability paths
  - Higher temperature = more diverse, lower probability paths
  - Search for common words to find more matches
  - Explore branches to discover interesting continuations

  ## Keyboard Shortcuts

  - `Ctrl + Enter`: Generate tokens
  - `Ctrl + F`: Search for substring
  - `Ctrl + R`: Reset game
  - `Escape`: Clear selection
  ```

- [ ] Create developer guide (`docs/DEVELOPER_GUIDE.md`):
  ```markdown
  # Token Tree Game - Developer Guide

  ## Project Structure

  \`\`\`
  token-tree-web/
  ├── src/
  │   ├── lib/
  │   │   ├── llm/           # LLM abstraction and implementations
  │   │   ├── game/           # Game logic and state management
  │   │   └── rendering/      # Canvas rendering
  │   ├── components/         # Svelte components
  │   ├── app.css            # Global styles
  │   └── main.ts           # Entry point
  ├── docs/                  # Documentation
  ├── package.json
  └── vite.config.ts
  \`\`\`

  ## Architecture

  ### LLM Abstraction

  The game uses an interface-based design for LLM backends:

  \`\`\`typescript
  interface LLMBackend {
    generateTokens(prompt: string, params: GenerationParams): Promise<TokenData[]>;
    continueGeneration(basePrompt: string, branchTokens: string[], params: GenerationParams): Promise<TokenData[]>;
  }
  \`\`\`

  Current implementations:
  - `WebLLMBackend`: Browser-based inference using WebGPU

  Future implementations could include:
  - `ServerBackend`: Server-hosted LLM
  - `CloudBackend`: OpenAI/Anthropic APIs

  ### Game State

  Game state is managed using Svelte 5's `$state` runes:

  \`\`\`typescript
  class GameState {
    tokens = $state<Map<string, TokenData>>(new Map());
    branches = $state<Map<string, BranchData>>(new Map());
    // ...
  }
  \`\`\`

  ### Layout Algorithms

  Layout algorithms implement a common interface:

  \`\`\`typescript
  interface LayoutAlgorithm {
    layout(tokens: TokenData[], branches: BranchData[]): LayoutResult;
    getName(): string;
  }
  \`\`\`

  Current implementations:
  - `SimpleTreeLayout`: Horizontal tree with stacked alternatives
  - `ForceDirectedLayout`: Physics-based organic layout

  ### Rendering

  The game uses HTML5 Canvas for rendering:

  - `CanvasRenderer`: Handles all drawing operations
  - Layered rendering: connections → paths → nodes
  - Zoom and pan support
  - Hit detection for interactions

  ## Adding a New Layout Algorithm

  1. Create a class implementing `LayoutAlgorithm`
  2. Register it in `LayoutManager`
  3. Add to algorithm selector UI

  ## Adding a New LLM Backend

  1. Create a class implementing `LLMBackend`
  2. Implement `generateTokens()` and `continueGeneration()`
  3. Add to backend selector UI

  ## Development Workflow

  \`\`\`bash
  # Install dependencies
  npm install

  # Start development server
  npm run dev

  # Type checking
  npm run check

  # Linting
  npm run lint

  # Build for production
  npm run build
  \`\`\`
  ```

- [ ] Create troubleshooting guide (`docs/TROUBLESHOOTING.md`):
  ```markdown
  # Troubleshooting

  ## WebGPU Not Supported

  **Problem**: "WebGPU is not supported in this browser"

  **Solution**:
  - Use Chrome 113+ or Edge 113+
  - Enable WebGPU in `chrome://flags` if needed
  - Try Firefox Nightly with WebGPU enabled

  ## Model Loading Fails

  **Problem**: Model download fails or gets stuck

  **Solution**:
  - Check internet connection
  - Try a smaller model (e.g., Phi-3-mini instead of Llama-3.2)
  - Clear browser cache and reload
  - Check browser console for errors

  ## Slow Performance

  **Problem**: Game is slow or laggy

  **Solution**:
  - Use a smaller model
  - Reduce max tokens
  - Close other browser tabs
  - Check GPU acceleration is enabled

  ## Canvas Not Rendering

  **Problem**: Tree visualization doesn't appear

  **Solution**:
  - Check browser console for errors
  - Ensure Canvas is supported
  - Try refreshing the page
  - Check that tokens were generated successfully

  ## Branches Not Creating

  **Problem**: Clicking alternative tokens doesn't create branches

  **Solution**:
  - Check if max branches (5) is reached
  - Ensure LLM backend is initialized
  - Check browser console for errors
  - Verify alternative tokens have valid data
  ```

- [ ] Create LICENSE file:
  ```markdown
  MIT License

  Copyright (c) 2026 Token Tree Game

  Permission is hereby granted, free of charge, to any person obtaining a copy
  of this software and associated documentation files (the "Software"), to deal
  in the Software without restriction, including without limitation the rights
  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
  copies of the Software, and to permit persons to whom the Software is
  furnished to do so, subject to the following conditions:

  The above copyright notice and this permission notice shall be included in all
  copies or substantial portions of the Software.

  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
  SOFTWARE.
  ```

- [ ] Create .gitignore:
  ```
  node_modules/
  dist/
  .svelte-kit/
  .DS_Store
  *.log
  .env
  .env.local
  ```

- [ ] Test deployment:
  - Build production version
  - Test locally with `npm run preview`
  - Deploy to Raspberry Pi
  - Test from external device
  - Verify all features work
  - Test on different browsers
  - Test on mobile devices

## Acceptance Criteria

- [ ] Production build creates optimized files
- [ ] Build works locally with `npm run preview`
- [ ] Deployment script works for Raspberry Pi
- [ ] Nginx configuration is correct
- [ ] README.md provides clear setup instructions
- [ ] User guide explains how to play
- [ ] Developer guide explains architecture
- [ ] Troubleshooting guide covers common issues
- [ ] LICENSE file is included
- [ ] .gitignore is configured
- [ ] Game works when deployed to Raspberry Pi

## Tutorial Notes

**What you'll learn:**
- Production build configuration with Vite
- Deployment workflows
- Nginx configuration for static hosting
- Documentation best practices
- Build optimization techniques
- Security headers and caching

**Key concepts:**
- Production builds should be minified and optimized
- Static files can be served with Nginx
- Documentation helps users and developers
- Security headers protect against common vulnerabilities
- Caching improves performance

**Key deployment concepts:**
- Build once, deploy many times
- Use CI/CD for automated deployments
- Monitor deployed applications
- Keep documentation up to date

**Resources:**
- [Vite Build Configuration](https://vitejs.dev/guide/build.html)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Writing READMEs](https://www.makeareadme.com/)
- [Web Deployment Best Practices](https://web.dev/)

## Related Issues

- All previous issues

## Future Work

- Add CI/CD pipeline
- Add automated testing
- Add performance monitoring
- Add analytics
- Add error tracking