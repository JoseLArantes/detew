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
const expectedData = deriveExpectedRequirements(
  fs.readFileSync(path.join(root, "docs/PRD.md"), "utf8"),
  fs.readFileSync(path.join(root, "docs/MILESTONES.md"), "utf8"),
  fs.readFileSync(path.join(root, "docs/tasks/COVERAGE.md"), "utf8"),
);
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

test("the ledger rejects a fabricated revision or evidence reference", () => {
  const changed = rows.map((row) => [...row]);
  changed[1][4] = "deadbeef";
  assert.throws(
    () => validateRows(changed, expectedData.expected),
    /must not invent implementation_revision/,
  );
});
