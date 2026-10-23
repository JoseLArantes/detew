/* SPDX-License-Identifier: MIT */
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { uiRoot } from "../scripts/contracts.mjs";

test("the TypeScript lint configuration rejects explicit any at a boundary", async (t) => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "detew-unsafe-ts-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const sourcePath = path.join(directory, "unsafe.ts");
  await writeFile(sourcePath, "export const input: any = {};\n");
  const result = spawnSync(
    "biome",
    ["check", "--config-path", path.join(uiRoot, "biome.json"), sourcePath],
    {
      cwd: uiRoot,
      encoding: "utf8",
    },
  );

  assert.notEqual(result.status, 0, `${result.stdout}${result.stderr}`);
  assert.match(`${result.stdout}${result.stderr}`, /noExplicitAny/);
});
