#!/usr/bin/env bash
set -e

echo "Running tests with code coverage..."
npx ng test bloc-ui-core --coverage

echo "Done! Coverage report available in coverage/"
