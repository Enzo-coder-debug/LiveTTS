#!/bin/zsh
set -e
cd "$(dirname "$0")"
if ! command -v node >/dev/null; then
  echo "需要 Node.js 22 或更新版本。"
  read -k 1
  exit 1
fi
node scripts/console-server.mjs --open --edit
