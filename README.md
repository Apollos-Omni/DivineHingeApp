# AI Orchestrator Starter

This starter adds an **AI Orchestrator** to your project that can:
- Receive tasks from your frontend/back‑end (via Supabase DB or HTTP).
- Call **OpenAI** (ChatGPT) to analyze/fix code.
- Open branches/PRs on **GitHub** and comment on issues.
- Optionally talk to **GitHub MCP Server** and a **Supabase MCP Server** (if you enable them).
- Run local checks/test commands and report results back.
- Hand off diffs to other AIs (e.g., Copilot via MCP or CI bots) and apply their patches.

> This is a scaffold: fill in secrets in `.env` and tweak commands in `ai.config.ts`.
> You can run it locally or from GitHub Actions.

## Quick start

1) Copy the `ai/` folder into your repo root (or place this whole starter at repo root).
2) Create `.env` from `.env.example` and set secrets.
3) Install deps:
   ```bash
   cd ai
   npm i
   npm run build
   ```
4) Run a test task:
   ```bash
   node dist/index.js --task "Scan repo, suggest fixes, open PR 'ai/initial-cleanup'"
   ```

## Frontend → Orchestrator

- Frontend posts tasks to a Supabase table (`ai_tasks`) or calls the Edge Function `/ai/submit`.
- Orchestrator polls `ai_tasks` or receives a webhook and processes work.

## Limitations / Notes

- **GitHub Copilot** has management APIs but no general “generate code programmatically” API. Use **Copilot/MCP** or CI-based AI review actions to “handoff” work. See `docs/INTEGRATIONS.md`.
- **Supabase AI** in Studio is interactive; programmatic control is via your own Edge Functions or an **MCP server** that wraps the Supabase Management API.

