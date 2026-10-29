# OzAI Digital website (ozai.digital)

Static HTML/CSS site served by GitHub Pages from `main` (repo root, custom domain via `CNAME`). No build step.

## Delivery mode

**Straight to `main`.** Commit and push to `main`; every push goes live on ozai.digital. No branches, no PRs, no preview deployments.

## Notes

- All pages share `styles.css` (token-based design system) and `site.js` (mobile nav, header scroll state, scroll reveals). `deck.js` drives the `*-deck.html` presentation pages.
- The contact form on `index.html` posts to the `ozai-email-sender` Cloudflare Worker and uses Turnstile; its sitekey only allows the live domain, so it can't be tested on localhost.
