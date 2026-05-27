#!/bin/bash
set -euo pipefail

# Public-only staging. Do not pull private Mall/DCP work into the web repo.

git add \
  index.html \
  style.css \
  CNAME \
  .nojekyll \
  assets \
  images \
  public \
  next.config.ts \
  package.json \
  tailwind.config.ts

git commit -m "Morris Lane: public site staging" || echo "No changes to commit"
