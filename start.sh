#!/bin/bash
set -e

windscribe-helper &
sleep 10 # wait for Windscribe to initialize

windscribe login "$WINDSCRIBE_USER" "$WINDSCRIBE_PASS"

windscribe connect Spain

# Check if VPN is connected
echo "Connected VPN. Checking IP:"
curl -s https://ipinfo.io

# run the script to book the class
bun run scripts/book.ts