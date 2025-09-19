import { execa } from "execa";
import type { AppConfig } from "../ai.config.js";

export async function runChecks(cfg: AppConfig) {
  const cwd = cfg.repoLocalPath;
  const results: Record<string, { ok: boolean; out: string }> = {};

  async function step(name: string, cmd: string, args: string[]) {
    try {
      const { stdout } = await execa(cmd, args, { cwd });
      results[name] = { ok: true, out: stdout.slice(0, 8000) };
    } catch (err: any) {
      results[name] = { ok: false, out: (err.stdout || err.stderr || String(err)).slice(0,8000) };
    }
  }

  await step("typecheck", "npm", ["run", "typecheck"]);
  await step("lint", "npm", ["run", "lint"]);
  await step("test", "npm", ["test", "--", "--watchAll=false"]);
  return results;
}
