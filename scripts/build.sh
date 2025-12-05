#!/bin/bash

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

source "$SCRIPT_DIR/variants.sh"

echo "Building all variants..."

for variant in "${VARIANTS[@]}"; do
  echo ""
  echo "========================================="
  echo "Building: $variant"
  echo "========================================="
  cd "$ROOT_DIR/$variant"
  npm run build
done

echo ""
echo "All variants built successfully!"


