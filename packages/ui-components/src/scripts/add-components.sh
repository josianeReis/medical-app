#!/usr/bin/env bash
set -e

bunx shadcn@latest add "$@"

for comp in "$@"; do
  comp_lower=$(echo "$comp" | tr '[:upper:]' '[:lower:]')
  line="export * from \"./components/ui/${comp_lower}\";"
  grep -qxF "$line" src/index.ts || echo "$line" >> src/index.ts
done