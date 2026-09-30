#!/bin/sh
if [ "$1" = "--mcp" ] || [ "$MCP_HOSTED" = "true" ] || [ "$MCP_HOSTED" = "1" ]; then
  exec npx mcp-proxy --port 8080 --host 0.0.0.0 -- node /app/dist/src/mcp.js --hosted
else
  exec node /app/dist/src/index.js "$@"
fi
