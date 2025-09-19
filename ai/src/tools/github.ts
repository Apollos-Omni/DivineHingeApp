import { Octokit } from "@octokit/rest";
import { simpleGit } from "simple-git";
import path from "node:path";
import fs from "node:fs";
import { execa } from "execa";
import type { AppConfig } from "../ai.config.js";

export function githubClient(token: string) {
  return new Octokit({ auth: token });
}

export async function ensureBranch(cfg: AppConfig, branch: string) {
  const git = simpleGit({ baseDir: cfg.repoLocalPath });
  await git.fetch();
  const branches = await git.branchLocal();
  if (!branches.all.includes(branch)) {
    await git.checkoutBranch(branch, `origin/${cfg.defaultBranch}`);
  } else {
    await git.checkout(branch);
  }
}

export async function applyPatch(cfg: AppConfig, patchText: string) {
  const dir = cfg.repoLocalPath;
  const patchPath = path.join(dir, ".ai/last.patch");
  fs.mkdirSync(path.dirname(patchPath), { recursive: true });
  fs.writeFileSync(patchPath, patchText, "utf-8");
  await execa("git", ["apply", patchPath], { cwd: dir });
}

export async function commitAndPush(cfg: AppConfig, message: string, branch: string) {
  const git = simpleGit({ baseDir: cfg.repoLocalPath });
  await git.add("."); 
  await git.commit(message);
  await git.push("origin", branch);
}

export async function openPullRequest(cfg: AppConfig, branch: string, title: string, body: string) {
  const gh = githubClient(cfg.githubToken);
  const { data } = await gh.pulls.create({
    owner: cfg.repoOwner,
    repo: cfg.repoName,
    head: branch,
    base: cfg.defaultBranch,
    title,
    body,
  });
  return data.html_url;
}
