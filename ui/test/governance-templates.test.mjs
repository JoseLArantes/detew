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
  assert.match(template, /Local correction drafts stay on the contributor's device/);
  assert.match(template, /publicly reproducible hostname or synthetic example/);
  assert.match(template, /personal browsing record/);
  assert.match(template, /Source and rights/);
  assert.match(template, /Privacy review/);
  assert.match(
    template,
    /deliberately authorize this reviewed content to be submitted as a public issue/,
  );
  assert.match(template, /Redaction preview/);
});

test("bug and feature forms capture versions, scope, expected behavior, and safe context", () => {
  const bug = read(".github/ISSUE_TEMPLATE/bug_report.md");
  const feature = read(".github/ISSUE_TEMPLATE/feature_request.md");
  assert.match(bug, /Detew version\/commit/);
  assert.match(bug, /What did you expect\?/);
  assert.match(bug, /Impact scope/);
  assert.match(bug, /redaction preview/);
  assert.match(feature, /PRD requirement, task, architecture decision/);
  assert.match(feature, /Current Detew version\/revision/);
  assert.match(feature, /Scope and visibility/);
  assert.match(feature, /expected outcome/);
  assert.match(feature, /Redaction preview/);
  assert.match(feature, /Do not attach browsing records, credentials, appliance backups/);
});

test("contributor guidance and PR template use Conventional Commits without DCO or CLA barriers", () => {
  const contributing = read("CONTRIBUTING.md");
  const pullRequest = read(".github/pull_request_template.md");
  assert.match(contributing, /Conventional Commits/);
  assert.match(contributing, /unit, integration, and smoke tests/);
  assert.match(contributing, /right to submit it under the project's MIT terms/);
  assert.match(contributing, /You keep the copyright/);
  assert.match(contributing, /identify any incorporated third-party material/i);
  assert.doesNotMatch(contributing, /DCO|Developer Certificate of Origin|git commit -s/i);
  assert.doesNotMatch(contributing, /required CLA|must sign a CLA/i);
  assert.match(pullRequest, /Conventional Commits/);
  assert.doesNotMatch(pullRequest, /DCO|Developer Certificate of Origin|git commit -s/i);
  assert.match(pullRequest, /Unit:/);
  assert.match(pullRequest, /Integration:/);
  assert.match(pullRequest, /Smoke:/);
  assert.match(pullRequest, /Foundation impact.*contracts, tasks, gates, dependencies/);
  assert.match(pullRequest, /Expected and observed outcome/);
  assert.match(pullRequest, /Exact tested revision and relevant tool\/environment versions/);
  assert.match(pullRequest, /Redaction preview/);
  assert.match(pullRequest, /does not authorize deployment or publication of local data/);
});
