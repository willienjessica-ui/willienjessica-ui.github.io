#!/bin/bash
set -euo pipefail

# Public-only publish path.
# This script intentionally stages only the site files that belong on the public Morris Lane surface.

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

git commit -m "DEPLOY: Morris Lane public site update" || echo "No changes to commit"
git push origin main
