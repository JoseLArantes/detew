/* SPDX-License-Identifier: MIT */
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { validateFixtureManifest } from "../scripts/fixture-manifest.mjs";

async function fixtureDirectory(t) {
  const directory = await mkdtemp(path.join(os.tmpdir(), "detew-fixture-check-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  await mkdir(path.join(directory, "fixtures"), { recursive: true });
  return directory;
}

async function writeManifest(root, contents, updates = {}) {
  const fixturePath = path.join(root, "fixtures", "sample.json");
  await writeFile(fixturePath, contents);
  const manifest = {
    schemaVersion: 1,
    fixtures: [
      {
        id: "sample",
        path: "fixtures/sample.json",
        kind: "synthetic",
        license: "MIT",
        redistribution: true,
        provenance: "Generated test input",
        sha256: createHash("sha256").update(contents).digest("hex"),
        ...updates,
      },
    ],
  };
  const manifestPath = path.join(root, "fixtures", "manifest.json");
  await writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  return manifestPath;
}

test("synthetic fixtures with explicit redistribution rights and matching digests pass", async (t) => {
  const root = await fixtureDirectory(t);
  const manifestPath = await writeManifest(root, Buffer.from('{"sample":true}\n'));
  assert.equal(await validateFixtureManifest(manifestPath), 1);
});

test("missing redistribution permission is rejected", async (t) => {
  const root = await fixtureDirectory(t);
  const manifestPath = await writeManifest(root, Buffer.from('{"sample":true}\n'), {
    redistribution: false,
  });
  await assert.rejects(validateFixtureManifest(manifestPath), /redistribution permission/);
});

test("credential-like content is rejected even when marked synthetic", async (t) => {
  const root = await fixtureDirectory(t);
  const manifestPath = await writeManifest(
    root,
    Buffer.from("DETEW-SYNTHETIC-SECRET: example-only\n"),
  );
  await assert.rejects(validateFixtureManifest(manifestPath), /credential-like marker/);
});

test("a fixture path that escapes the repository is rejected", async (t) => {
  const root = await fixtureDirectory(t);
  const manifestPath = await writeManifest(root, Buffer.from("safe\n"), {
    path: "../../etc/passwd",
  });
  await assert.rejects(validateFixtureManifest(manifestPath), /path escapes|ENOENT/);
});
