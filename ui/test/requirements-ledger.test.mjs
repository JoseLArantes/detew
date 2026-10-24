// SPDX-License-Identifier: MIT
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  deriveExpectedRequirements,
  parseCsv,
  validateRows,
} from "../../scripts/requirement-ledger.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const prd = fs.readFileSync(path.join(root, "docs/PRD.md"), "utf8");
const milestones = fs.readFileSync(path.join(root, "docs/MILESTONES.md"), "utf8");
const coverage = fs.readFileSync(path.join(root, "docs/tasks/COVERAGE.md"), "utf8");
const expectedData = deriveExpectedRequirements(prd, milestones, coverage);
const csv = fs.readFileSync(path.join(root, "docs/evidence/requirements.csv"), "utf8");
const rows = parseCsv(csv);

test("every PRD requirement has one unverified milestone and task evidence row", () => {
  assert.deepEqual(expectedData.counts, { V1: 73, T1: 7, E: 4 });
  assert.equal(rows.length, 85);
  assert.equal(validateRows(rows, expectedData.expected), true);
});

test("the ledger rejects duplicate and missing requirement IDs", () => {
  assert.throws(
    () => validateRows([...rows, rows[1]], expectedData.expected),
    /appears more than once/,
  );
  assert.throws(() => validateRows(rows.slice(0, -1), expectedData.expected), /is missing/);
});

test("the ledger rejects stale IDs, scopes, and primary milestones", () => {
  const staleId = rows.map((row) => [...row]);
  staleId.push([...rows[1]]);
  staleId.at(-1)[0] = "INS-99";
  assert.throws(() => validateRows(staleId, expectedData.expected), /INS-99 is stale/);

  const staleScope = rows.map((row) => [...row]);
  staleScope[1][1] = "T1";
  assert.throws(() => validateRows(staleScope, expectedData.expected), /INS-01 has stale scope/);

  const staleMilestone = rows.map((row) => [...row]);
  staleMilestone[1][2] = "M99";
  assert.throws(
    () => validateRows(staleMilestone, expectedData.expected),
    /INS-01 has stale primary_milestone/,
  );
});

test("source comparison rejects stale IDs and scope drift", () => {
  const staleMilestoneId = milestones.replace(
    "| INS-09 | V1 | M06 |",
    "| INS-09, INS-99 | V1 | M06 |",
  );
  assert.throws(
    () => deriveExpectedRequirements(prd, staleMilestoneId, coverage),
    /INS-99 is stale in MILESTONES\.md/,
  );

  const staleCoverageId = `${coverage}\n| INS-99 | V1 | [M00-W01-T01](m00/M00-W01-T01.md) |\n`;
  assert.throws(
    () => deriveExpectedRequirements(prd, milestones, staleCoverageId),
    /INS-99 is stale in COVERAGE\.md/,
  );

  const mismatchedScope = milestones.replace("| INS-09 | V1 | M06 |", "| INS-09 | T1 | M06 |");
  assert.throws(
    () => deriveExpectedRequirements(prd, mismatchedScope, coverage),
    /INS-09 scope differs between PRD\.md and MILESTONES\.md/,
  );
});

test("the ledger rejects a fabricated revision or evidence reference", () => {
  const changed = rows.map((row) => [...row]);
  changed[1][4] = "deadbeef";
  assert.throws(
    () => validateRows(changed, expectedData.expected),
    /must not invent implementation_revision/,
  );
});
