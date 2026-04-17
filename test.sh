#!/usr/bin/env bash
set -e

PROJECTS=(
    bloc-ui-core
    bloc-ui-modal
    bloc-ui-alert
    bloc-ui-autocomplete
    bloc-ui-table
    bloc-ui-pagination
    bloc-ui-slider
    bloc-ui-toast
    bloc-ui-tab
    bloc-ui-date-picker
    bloc-ui-overlay
    bloc-ui-select
    bloc-ui-tooltip
    bloc-ui-text-highlight
    bloc-ui-virtual-scroll
    bloc-ui-video-player
)

echo "Running tests with code coverage for all projects..."

for project in "${PROJECTS[@]}"; do
    echo ""
    echo "── Testing $project ──"
    npx ng test "$project" --coverage --watch=false
done

echo ""
echo "Done! Coverage reports available in coverage/"
