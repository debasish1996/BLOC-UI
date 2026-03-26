#!/usr/bin/env bash
set -e

CONFIG=""
if [[ "$1" == "--production" ]]; then
  CONFIG="--configuration production"
fi

echo "Building all projects..."

echo "Building bloc-ui-core..."
ng build bloc-ui-core $CONFIG

echo "Building bloc-ui-theme..."
ng build bloc-ui-theme $CONFIG

echo "Building bloc-ui-modal..."
ng build bloc-ui-modal $CONFIG

echo "Building bloc-ui-table..."
ng build bloc-ui-table $CONFIG

echo "Building bloc-ui-toast..."
ng build bloc-ui-toast $CONFIG

echo "Building bloc-ui-date-picker..."
ng build bloc-ui-date-picker $CONFIG

echo "Building bloc-ui-tab..."
ng build bloc-ui-tab $CONFIG

echo "Building bloc-ui..."
ng build bloc-ui $CONFIG

echo "Building demo..."
ng build demo $CONFIG

echo "All projects built successfully!"
