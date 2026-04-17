#!/usr/bin/env bash
set -e

./build.sh

echo "Starting demo app..."
ng serve demo
