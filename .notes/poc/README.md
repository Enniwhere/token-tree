# Token Tree Visualization

A visualization tool for exploring LLM token generation with alternative branches based on probability.

## Prerequisites

- Python 3 (for local server)
- [Ollama](https://ollama.ai/) running locally
- Gemma 3:1b model installed in Ollama

## Setup

1. Make sure Ollama is running:
```bash
ollama serve
```

2. Ensure you have the gemma3:1b model:
```bash
ollama pull gemma3:1b
```

## Running the Application

### Option 1: Using Python (Recommended - avoids CORS issues)

```bash
python3 serve.py
```

Then open your browser to: http://localhost:8000/index.html

### Option 2: Using Python's built-in server

```bash
python3 -m http.server 8000
```

Then open your browser to: http://localhost:8000/index.html

### Option 3: Direct file access (may have CORS issues)

Simply open `index.html` in your browser. Note: This may not work due to CORS restrictions when accessing the Ollama API.

## Usage

1. Enter a prompt in the text area (or click an example prompt)
2. Set the maximum number of tokens to generate (default: 50)
3. Click "Generate" to create the visualization
4. The tree will show:
   - **Main path**: The tokens actually generated (larger, darker text)
   - **Alternative branches**: Other possible tokens with >5% probability (smaller, lighter text)
   - **Line thickness**: Represents cumulative probability

## Configuration

You can adjust settings in `script.js`:

- `minAlternativeProbability`: Minimum probability threshold for showing alternatives (default: 0.05 = 5%)
- `maxTopLogprobs`: Number of alternative tokens to request from the API (default: 4)
- `modelName`: The Ollama model to use (default: 'gemma3:1b')

## Features

- Real-time token generation from Ollama
- Probability-based alternative visualization
- Configurable token limits
- Example prompts for quick testing
- Mock data option for testing without API calls

## Troubleshooting

### CORS Errors
If you see CORS errors in the browser console, make sure you're using the Python server (`python3 serve.py`) instead of opening the HTML file directly.

### Ollama Connection Errors
- Verify Ollama is running: `ollama list`
- Check the Ollama API is accessible: `curl http://localhost:11434/api/tags`
- Make sure the gemma3:1b model is installed

### No Logprobs
If you get "No logprobs in response", ensure you're using a recent version of Ollama that supports the logprobs feature.
