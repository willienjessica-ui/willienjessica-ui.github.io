# Morris Lane Deployment Boundary

This repository is the public Morris Lane site source.

Public-only rules:

- stage only the site files that belong on the public web surface
- do not import Debbie Prime memory
- do not add private runtime files
- do not add DCP / NeoDas backend files into the public deployment path
- do not add receipts, work orders, or raw private vault content to the public site

Public surface:

- `index.html`
- `style.css`
- `assets/`
- `images/`
- `public/`
- `CNAME`
- `.nojekyll`

Private Mall backend:

- lives in the separate Mall-side skeleton paths outside this repo
- should be packaged separately for a private server or protected backend deployment

If this file and the deploy scripts disagree, the deploy scripts must win for safety.
