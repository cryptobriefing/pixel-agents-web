# pixel-agents-web (Vercel fork)

Forked from [pablodelucca/pixel-agents](https://github.com/pablodelucca/pixel-agents) for browser deployment only. **Upstream is canonical for the VS Code extension** — this fork exists solely to serve the `webview-ui/` directory as a standalone Vercel deployment so coworkers can spectate the office without VS Code installed.

## Status

- **v0 (current):** Mock-data deploy. The existing `browserMock.ts` provides synthetic characters and assets. Deploys cleanly to Vercel; useful as a demo and to validate the Vercel pipeline.
- **v1 (planned):** WebSocket client replaces the mock data path. Connects to an `office-bridge` daemon on Gloria EC2 that translates `~/.claude-bus/` and Claude Code transcript events into the same `window.MessageEvent`s the React app already consumes.
- **v2 (planned):** Cloudflare Access on the Vercel deployment + WS endpoint, restricted to Diego/John/Han Google accounts.

## Why a separate fork?

Vercel's static-build path doesn't run Vite's dev-server middleware, so the `/assets/decoded/*.json` endpoints return 404 in production. `browserMock.ts` already has a built-in fallback: it tries the decoded JSON, gets null, and decodes the PNGs in the browser at runtime. Same behavior, slightly heavier first paint (~1.6 MB of PNGs vs. ~few-hundred-KB JSON), no behavioral difference once loaded.

## Deploy

Auto-deploys on push to `main` via Vercel project on the Crypto Briefing team (`cb-3a349800`). Output directory: `dist/webview`. Build runs from repo root (`vercel.json`).

## Will I sync from upstream?

Yes — periodically merge `upstream/main` for sprite/animation improvements. This fork is a thin layer on top; never let it drift far from upstream.
