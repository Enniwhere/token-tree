#!/bin/bash
# Quick start script for Token Tree Visualization

echo "🌳 Token Tree Visualization"
echo "============================"
echo ""

# Check if Ollama is running
if ! curl -s http://localhost:11434/api/tags > /dev/null 2>&1; then
    echo "⚠️  Warning: Ollama doesn't appear to be running"
    echo "   Start it with: ollama serve"
    echo ""
fi

# Check if gemma3:1b is available
if curl -s http://localhost:11434/api/tags 2>/dev/null | grep -q "gemma3:1b"; then
    echo "✓ Ollama is running"
    echo "✓ gemma3:1b model found"
else
    echo "⚠️  gemma3:1b model not found"
    echo "   Install it with: ollama pull gemma3:1b"
fi

echo ""
echo "Starting local server on http://localhost:9001"
echo "Press Ctrl+C to stop"
echo ""

# Start the server
python3 serve.py
