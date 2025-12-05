#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

source "$SCRIPT_DIR/variants.sh"

echo "Linting all variants..."

for variant in "${VARIANTS[@]}"; do
  echo ""
  echo "========================================="
  echo "Linting: $variant"
  echo "========================================="
  cd "$ROOT_DIR/$variant"
  npm run lint
done

echo ""
echo "All variants linted successfully!"


