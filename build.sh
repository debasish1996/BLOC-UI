#!/usr/bin/env bash
set -e

echo "Building all projects..."

echo "Building bloc-ui-core..."
ng build bloc-ui-core

echo "Building bloc-ui-theme..."
ng build bloc-ui-theme

echo "Building bloc-ui-modal..."
ng build bloc-ui-modal

echo "Building bloc-ui-table..."
ng build bloc-ui-table

echo "Building bloc-ui-toast..."
ng build bloc-ui-toast

echo "Building bloc-ui-date-picker..."
ng build bloc-ui-date-picker

echo "Building bloc-ui-tab..."
ng build bloc-ui-tab

echo "Building bloc-ui..."
ng build bloc-ui

echo "Building demo..."
ng build demo

echo "All projects built successfully!"
