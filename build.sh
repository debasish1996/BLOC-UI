#!/usr/bin/env bash
set -e

CONFIG=""
if [[ "$1" == "--production" ]]; then
  CONFIG="--configuration production"
fi

echo "Building all projects..."

echo "Building bloc-ui-core..."
npx ng build bloc-ui-core $CONFIG

echo "Building bloc-ui-overlay..."
npx ng build bloc-ui-overlay $CONFIG

echo "Building bloc-ui-theme..."
npx ng build bloc-ui-theme $CONFIG

echo "Building bloc-ui-modal..."
npx ng build bloc-ui-modal $CONFIG

echo "Building bloc-ui-accordion..."
npx ng build bloc-ui-accordion $CONFIG

echo "Building bloc-ui-alert..."
npx ng build bloc-ui-alert $CONFIG

echo "Building bloc-ui-autocomplete..."
npx ng build bloc-ui-autocomplete $CONFIG

echo "Building bloc-ui-layout..."
npx ng build bloc-ui-layout $CONFIG

echo "Building bloc-ui-pagination..."
npx ng build bloc-ui-pagination $CONFIG

echo "Building bloc-ui-slider..."
npx ng build bloc-ui-slider $CONFIG

echo "Building bloc-ui-table..."
npx ng build bloc-ui-table $CONFIG

echo "Building bloc-ui-toast..."
npx ng build bloc-ui-toast $CONFIG

echo "Building bloc-ui-date-picker..."
npx ng build bloc-ui-date-picker $CONFIG

echo "Building bloc-ui-tab..."
npx ng build bloc-ui-tab $CONFIG

echo "Building bloc-ui-select..."
npx ng build bloc-ui-select $CONFIG

echo "Building bloc-ui-tooltip..."
npx ng build bloc-ui-tooltip $CONFIG

echo "Building bloc-ui-virtual-scroll..."
npx ng build bloc-ui-virtual-scroll $CONFIG

echo "Building bloc-ui-video-player..."
npx ng build bloc-ui-video-player $CONFIG

echo "Building bloc-ui..."
npx ng build bloc-ui $CONFIG

echo "Building demo..."
npx ng build demo $CONFIG

echo "All projects built successfully!"
