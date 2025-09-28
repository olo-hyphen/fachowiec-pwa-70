#!/bin/bash
# Deploy Vite build to GitHub Pages (cross-branch safe)
set -e

# Ensure on main branch
git checkout main

# Build project
npm run build

# Copy dist to temp
rm -rf /tmp/fachowiec-pwa-70-dist
cp -r dist /tmp/fachowiec-pwa-70-dist

# Switch to gh-pages branch (create if doesn't exist)
git checkout gh-pages || git checkout --orphan gh-pages

# Remove all files except .git
find . -maxdepth 1 ! -name '.git' ! -name '.' -exec rm -rf {} +

# Copy build output from temp
cp -r /tmp/fachowiec-pwa-70-dist/* .

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages" || echo "Nothing to commit"
git push origin gh-pages

# Switch back to main branch
git checkout main
