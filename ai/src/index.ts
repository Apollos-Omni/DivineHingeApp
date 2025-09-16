import "dotenv/config";
import { readConfig } from "./ai.config.js";
import { planWithLLM } from "./llm.js";
import { ensureBranch, applyPatch, commitAndPush, openPullRequest } from "./tools/github.js";
import { runChecks } from "./tools/tests.js";

const cfg = readConfig();
const task = process.argv.slice(2).join(" ") || "Analyze repo and suggest first PR";

const SYSTEM = `You are the project AI Orchestrator. 
- You can analyze the repository, propose changes as *unified diffs*, and request to run checks.
- When proposing changes, return a complete patch ready for \`git apply\`.
- Prefer small focused branches and open a PR with a clear title + body.
- If tests fail, refine the patch and try again.
- If the diff is too large, break it into multiple PRs.`;

async function main() {
  const res = await planWithLLM({
    cfg,
    systemPrompt: SYSTEM,
    messages: [
      { role: "user", content: `Task: ${task}
Default branch: ${cfg.defaultBranch}` }
    ],
    tools: [
      // You can wire MCP tools here later if you host them
    ]
  });

  // Very light parsing: look for a ```patch block
  const text = JSON.stringify(res, null, 2);
  const match = text.match(/```patch\n([\s\S]*?)```/);
  if (!match) {
    console.log("No patch returned. Raw response follows:\n", text.slice(0, 6000));
    return;
  }
  const patch = match[1];

  const branch = `ai/${Date.now()}`;
  await ensureBranch(cfg, branch);
  await applyPatch(cfg, patch);
  await commitAndPush(cfg, "AI: apply patch", branch);

  const checks = await runChecks(cfg);
  const allOk = Object.values(checks).every((r) => r.ok);
  const title = allOk ? "AI patch: ready" : "AI patch: needs follow-up (checks failing)";
  const body = [
    "Automated patch by AI Orchestrator.",
    "### Checks",
    ...Object.entries(checks).map(([k, v]) => `- ${k}: ${v.ok ? "✅" : "❌"}`),
    "\n<details><summary>Details</summary>\n\n",
    "```txt",
    ...Object.entries(checks).map(([k, v]) => `--- ${k} ---\n${v.out}`),
    "```",
    "\n</details>\n"
  ].join("\n");

  const prUrl = await openPullRequest(cfg, branch, title, body);
  console.log("Opened PR:", prUrl);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
