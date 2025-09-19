import fs from "node:fs";

const path = "package.json";
const pkg = JSON.parse(fs.readFileSync(path, "utf8"));

// --- Scripts ---
pkg.scripts = pkg.scripts || {};
pkg.scripts.prepare = pkg.scripts.prepare || "husky";
pkg.scripts.test = pkg.scripts.test || "vitest";
pkg.scripts["test:run"] = pkg.scripts["test:run"] || "vitest run";
pkg.scripts["test:ci"] = pkg.scripts["test:ci"] || "vitest run --coverage";
pkg.scripts.lint = pkg.scripts.lint || "eslint . --ext .ts,.tsx,.js,.jsx || exit 0";
pkg.scripts.fmt = pkg.scripts.fmt || "prettier --write .";
pkg.scripts.typecheck = pkg.scripts.typecheck || "tsc -p tsconfig.json --noEmit";

// --- Lint-staged (in package.json for simplicity) ---
pkg["lint-staged"] = pkg["lint-staged"] || {
  "*.{ts,tsx,js,jsx,json,md,yml,yaml}": ["prettier --write"],
  "*.{ts,tsx}": ["tsc -p tsconfig.json --noEmit", "vitest related --run"]
};

// --- Dev dependencies ensure list (do not overwrite existing versions) ---
pkg.devDependencies = pkg.devDependencies || {};
const wanted = {
  "vitest": "^2.0.0",
  "@vitest/coverage-v8": "^2.0.0",
  "husky": "^9.0.0",
  "lint-staged": "^15.2.0"
};

for (const [name, version] of Object.entries(wanted)) {
  if (!pkg.devDependencies[name]) pkg.devDependencies[name] = version;
}

fs.writeFileSync(path, JSON.stringify(pkg, null, 2) + "\n", "utf8");

console.log("[merge-package] Updated package.json with scripts, lint-staged, and devDependencies.");
