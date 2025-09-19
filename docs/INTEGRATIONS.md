# Integrations

## ChatGPT / OpenAI
- Uses the `openai` SDK. We call the **Responses API** and (optionally) attach **MCP** tools.

## GitHub
- Uses Octokit REST API for branches, commits, PRs, comments.
- Optional **GitHub MCP Server** lets LLMs act on your repos as tools from within Responses.

## Supabase
- `@supabase/supabase-js` for DB and Storage.
- Edge Function `supabase/functions/ai-router` to proxy/guard AI calls.
- Optional **Supabase MCP Server** (community) to manage projects/resources.

## Handoff to other AIs
- You can push diffs to a PR and let **AI Code Review** actions comment.
- If you enable Copilot MCP in your IDE, your local Copilot can consume the same task context.
