#!/bin/bash
echo "Starting webpack build..."
cd /Users/balajialwar/Berkeley/repos/nbgitpuller-link-generator-webextension
npx webpack --mode production --stats verbose
echo "Build completed!"
ls -la dist-chrome/bundle.js
echo "Checking bundle size:"
wc -c dist-chrome/bundle.js
