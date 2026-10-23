/* SPDX-License-Identifier: MIT */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const defaultRoot = path.resolve(scriptDirectory, "../..");
const rootArgument = process.argv.indexOf("--root");
const root = rootArgument === -1 ? defaultRoot : path.resolve(process.argv[rootArgument + 1] ?? "");

const result = spawnSync(
  "cargo",
  [
    "metadata",
    "--no-deps",
    "--format-version",
    "1",
    "--manifest-path",
    path.join(root, "Cargo.toml"),
  ],
  { cwd: root, encoding: "utf8" },
);
if (result.status !== 0) {
  process.stderr.write(result.stderr || "cargo metadata failed\n");
  process.exit(result.status ?? 1);
}

const metadata = JSON.parse(result.stdout);
const allowed = new Map([
  ["detew-domain", new Set(["schemars", "serde"])],
  ["detew-policy", new Set(["detew-domain"])],
  ["detew-reference", new Set(["detew-policy"])],
  ["detew-schema-gen", new Set(["detew-domain", "schemars", "serde_json"])],
]);
const violations = [];

for (const pkg of metadata.packages) {
  const allowedDependencies = allowed.get(pkg.name);
  if (!allowedDependencies) continue;

  const runtimeDependencies = pkg.dependencies.filter(
    (dependency) => dependency.kind === null || dependency.kind === "normal",
  );
  for (const dependency of runtimeDependencies) {
    if (!allowedDependencies.has(dependency.name)) {
      violations.push(
        `${pkg.name} -> ${dependency.name} (runtime dependency is outside its allowlist)`,
      );
    }
  }
}

if (violations.length > 0) {
  process.stderr.write(
    `Portable dependency boundary violations:\n${violations.map((line) => `- ${line}`).join("\n")}\n`,
  );
  process.exit(1);
}

console.log("Portable crate runtime dependency allowlists are satisfied.");
