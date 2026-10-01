#!/bin/sh
if [ "$1" = "--mcp" ]; then
  exec npx supergateway --port 8080 --stdio "node /app/dist/src/mcp.js --hosted"
else
  exec node /app/dist/src/index.js "$@"
fi
