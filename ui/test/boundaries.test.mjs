/* SPDX-License-Identifier: MIT */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { uiRoot } from "../scripts/contracts.mjs";

test("portable crate runtime dependencies satisfy their allowlists", () => {
  const result = spawnSync(
    process.execPath,
    [path.join(uiRoot, "scripts", "check-boundaries.mjs")],
    {
      cwd: uiRoot,
      encoding: "utf8",
    },
  );
  assert.equal(result.status, 0, `${result.stdout}${result.stderr}`);
});

test("a network dependency injected into the domain crate is rejected", async (t) => {
  const root = await mkdtemp(path.join(os.tmpdir(), "detew-boundary-check-"));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(path.join(root, "crates", "detew-domain"), { recursive: true });
  await mkdir(path.join(root, "crates", "detew-domain", "src"), { recursive: true });
  await writeFile(
    path.join(root, "Cargo.toml"),
    '[workspace]\nmembers = ["crates/detew-domain"]\nresolver = "3"\n',
  );
  await writeFile(
    path.join(root, "crates", "detew-domain", "Cargo.toml"),
    '[package]\nname = "detew-domain"\nversion = "0.1.0"\nedition = "2024"\n\n[dependencies]\nreqwest = "0.12"\n',
  );
  await writeFile(
    path.join(root, "crates", "detew-domain", "src", "lib.rs"),
    "// synthetic boundary test\n",
  );

  const result = spawnSync(
    process.execPath,
    [path.join(uiRoot, "scripts", "check-boundaries.mjs"), "--root", root],
    { cwd: uiRoot, encoding: "utf8" },
  );
  assert.notEqual(result.status, 0, `${result.stdout}${result.stderr}`);
  assert.match(result.stderr, /detew-domain -> reqwest/);
});
