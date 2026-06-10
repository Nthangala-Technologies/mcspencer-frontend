# McSpencer Enterprise — Frontend

  React/Vite frontend for McSpencer Enterprise e-commerce platform.

  ## Structure
  - `mcspencer/` — React/Vite app source
  - `lib/` — Shared libraries

  ## Build for cPanel
  ```bash
  VITE_API_URL=https://your-api-domain.com pnpm --filter @workspace/mcspencer run build
  ```
  Output: `mcspencer/dist/public/` — upload to your `public_html`

  ## Local Dev
  ```bash
  pnpm install
  pnpm --filter @workspace/mcspencer run dev
  ```
  