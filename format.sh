#!/usr/bin/env bash
set -e

CHECK=""
WRITE="-w"
if [[ "$1" == "--check" ]]; then
  CHECK="--check"
  WRITE=""
  echo "Checking formatting..."
else
  echo "Formatting all files..."
fi

NO_COLOR=1 npx prettier --log-level warn --ignore-unknown $WRITE $CHECK "**/*"

if [[ -z "$CHECK" ]]; then
  echo "Done. All files formatted."
fi
