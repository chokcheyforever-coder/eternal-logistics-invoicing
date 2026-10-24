#!/bin/bash
# 1-Click Launcher for Eternal Logistics Invoicing System
PROJECT_DIR="/Users/darith/Projects/eternal-logistics-invoicing"

echo "=========================================================="
echo " Starting Eternal Logistics Invoicing System..."
echo "=========================================================="

cd "$PROJECT_DIR" || exit 1

# Check if node is installed
if ! command -v npm &> /dev/null; then
  export PATH="/Users/darith/.nvm/versions/node/v22.22.2/bin:$PATH:/usr/local/bin:/opt/homebrew/bin"
fi

# Check if port 3000 is running, if not start it
if ! lsof -i :3000 > /dev/null 2>&1; then
  echo "Launching server on http://localhost:3000..."
  nohup npm run dev -- --host > /dev/null 2>&1 &
  sleep 2
fi

echo "Opening Invoicing System in your browser..."
open "http://localhost:3000"

echo "System is ready! You can close this window."
