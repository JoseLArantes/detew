// SPDX-License-Identifier: MIT
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const read = (relativePath) => fs.readFileSync(path.join(root, relativePath), "utf8");

test("security reports are routed privately rather than through a public issue", () => {
  const config = read(".github/ISSUE_TEMPLATE/config.yml");
  const policy = read("SECURITY.md");
  assert.match(config, /security\/advisories\/new/);
  assert.match(policy, /GitHub's private vulnerability reporting form/);
  assert.match(policy, /Do not open a public issue/);
});

test("category corrections require public or synthetic evidence and a privacy review", () => {
  const template = read(".github/ISSUE_TEMPLATE/taxonomy_correction.md");
  assert.match(template, /publicly reproducible hostname or synthetic example/);
  assert.match(template, /personal browsing record/);
  assert.match(template, /Source and rights/);
  assert.match(template, /Privacy review/);
});

test("contributor guidance and PR template require Conventional Commits, DCO and relevant tests", () => {
  const contributing = read("CONTRIBUTING.md");
  const pullRequest = read(".github/pull_request_template.md");
  assert.match(contributing, /Conventional Commits/);
  assert.match(contributing, /unit, integration, and smoke tests/);
  assert.match(pullRequest, /Conventional Commits/);
  assert.match(pullRequest, /DCO/);
  assert.match(pullRequest, /Unit:/);
  assert.match(pullRequest, /Integration:/);
  assert.match(pullRequest, /Smoke:/);
});
