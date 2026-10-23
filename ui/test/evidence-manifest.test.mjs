/* SPDX-License-Identifier: MIT */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import { uiRoot } from "../scripts/contracts.mjs";

test("evidence manifest schema requires reproducible inputs and honest check results", async () => {
  const schemaPath = path.join(uiRoot, "..", "docs", "evidence", "evidence-manifest.schema.json");
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  const manifest = {
    schemaVersion: 1,
    taskId: "M00-W04-T01",
    requirements: ["OSS-02"],
    architectureDecisions: ["ARC-14"],
    gates: [],
    revision: "a".repeat(40),
    environment: { os: "macOS" },
    inputs: [{ name: "Rust", version: "1.99.1", sha256: "b".repeat(64) }],
    procedure: ["Run the portable check entry point."],
    expected: ["Native check reports unavailable."],
    observed: ["Native check reports unavailable."],
    limitations: ["No native adapter exists in M00."],
    reviewers: [{ name: "Reviewer", role: "independent", status: "pending" }],
    recordedAt: "2026-10-23T00:00:00Z",
    checks: [
      {
        name: "native",
        result: "unavailable",
        command: "./scripts/check-native.sh",
        details: "M00 baseline",
      },
    ],
  };

  assert.equal(validate(manifest), true, ajv.errorsText(validate.errors));
  assert.equal(validate({ ...manifest, revision: "unknown" }), false);
  assert.equal(
    validate({ ...manifest, checks: [{ ...manifest.checks[0], result: "pass" }] }),
    true,
    "the schema records result values; it does not infer that unavailable checks passed",
  );
});
