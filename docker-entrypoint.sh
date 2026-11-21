#!/bin/sh
case "$1" in
  mcp|--mcp|mcp:sse)
    exec npx supergateway --port "${PORT:-8080}" --stdio "node /app/dist/src/mcp.js --hosted"
    ;;
  mcp:stdio)
    shift
    exec node /app/dist/src/mcp.js "$@"
    ;;
  *)
    exec node /app/dist/src/index.js "$@"
    ;;
esac
