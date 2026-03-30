#!/usr/bin/env bash
set -e

CONFIG=""
if [[ "$1" == "--production" ]]; then
  CONFIG="--configuration production"
fi

echo "Building all projects..."

echo "Building bloc-ui-core..."
npx ng build bloc-ui-core $CONFIG

echo "Building bloc-ui-theme..."
npx ng build bloc-ui-theme $CONFIG

echo "Building bloc-ui-modal..."
npx ng build bloc-ui-modal $CONFIG

echo "Building bloc-ui-table..."
npx ng build bloc-ui-table $CONFIG

echo "Building bloc-ui-toast..."
npx ng build bloc-ui-toast $CONFIG

echo "Building bloc-ui-date-picker..."
npx ng build bloc-ui-date-picker $CONFIG

echo "Building bloc-ui-tab..."
npx ng build bloc-ui-tab $CONFIG

echo "Building bloc-ui-overlay..."
npx ng build bloc-ui-overlay $CONFIG

echo "Building bloc-ui..."
npx ng build bloc-ui $CONFIG

echo "Building demo..."
npx ng build demo $CONFIG

echo "All projects built successfully!"
