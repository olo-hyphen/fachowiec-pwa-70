#!/bin/bash
# Deploy Vite build to GitHub Pages
git fetch origin
git worktree add gh-pages origin/gh-pages || git checkout --orphan gh-pages
git worktree add dist-gh gh-pages
rm -rf dist-gh/*
cp -r dist/* dist-gh/
cd dist-gh
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
cd ..
git worktree remove dist-gh
