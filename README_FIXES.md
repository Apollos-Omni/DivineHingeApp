# DivineHingeApp Fix Pack

This bundle adds:
- Correct Husky pre-commit hook (fixes `.husky/_/_/husky.sh` path error)
- Vitest config + scripts
- lint-staged + Prettier pipeline
- Deno config for Supabase Edge Functions + example `hello` function
- VSCode settings to enable Deno **only** in `supabase/functions`

## Apply (Windows)

1. Extract this zip at the **repo root** (`DivineHingeApp/`).
2. Open PowerShell in the repo and run:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
   node -v
   npm -v
   deno --version   # optional but recommended for Edge Functions
   ```
3. Run the setup:
   ```powershell
   node scripts/merge-package.mjs
   npm i
   npm i -D vitest @vitest/coverage-v8 husky lint-staged
   npx husky init
   # overwrite hook with the one from this pack if needed
   Copy-Item -Force .husky\pre-commit .husky\pre-commit
   ```
4. Try tests:
   ```powershell
   npm run test:run
   ```
5. Commit on a new branch and push:
   ```powershell
   git checkout -b fix/deno-vitest-husky
   git add -A
   git commit -m "chore(repo): fix husky path, add vitest+lint-staged, deno config"
   git push -u origin fix/deno-vitest-husky
   ```

## Supabase Edge Functions locally

```powershell
supabase login
supabase link --project-ref <YOUR_PROJECT_REF>
supabase functions serve
```
Then call your function at `/functions/v1/hello`.

---

If VS Code doesn't recognize Deno, ensure you installed the Deno CLI, the official extension, and that `.vscode/settings.json` exists with `deno.enablePaths: ["supabase/functions"]`.
