#!/bin/bash

# Restart Angular Language Service
# This script kills the language server process and clears caches
# to force a fresh restart of the Angular language service in VS Code

echo "Restarting Angular Language Service..."

# Kill any running ngserver processes
pkill -f "ngserver" || true
echo "✓ Killed language server processes"

# Clear TypeScript cache
rm -rf node_modules/.angular || true
echo "✓ Cleared Angular cache"

# Clear ngcc cache (Angular Ivy compilation)
rm -rf node_modules/.ngcc-cache || true
echo "✓ Cleared ngcc cache"

# Optional: Clear VS Code language service cache
if [ -d "$HOME/AppData/Local/Code/User/workspaceStorage" ]; then
    # Windows path
    find "$HOME/AppData/Local/Code/User/workspaceStorage" -name "*language-server*" -type d -exec rm -rf {} + 2>/dev/null || true
    echo "✓ Cleared VS Code language service cache (Windows)"
elif [ -d "$HOME/.config/Code/User/workspaceStorage" ]; then
    # Linux path
    find "$HOME/.config/Code/User/workspaceStorage" -name "*language-server*" -type d -exec rm -rf {} + 2>/dev/null || true
    echo "✓ Cleared VS Code language service cache (Linux)"
elif [ -d "$HOME/Library/Application Support/Code/User/workspaceStorage" ]; then
    # macOS path
    find "$HOME/Library/Application Support/Code/User/workspaceStorage" -name "*language-server*" -type d -exec rm -rf {} + 2>/dev/null || true
    echo "✓ Cleared VS Code language service cache (macOS)"
fi

echo ""
echo "Language service restart complete!"
echo "If VS Code is open, reload the window (Ctrl+Shift+P > Developer: Reload Window)"
