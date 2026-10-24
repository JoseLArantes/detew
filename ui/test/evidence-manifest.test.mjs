/* SPDX-License-Identifier: MIT */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import { uiRoot } from "../scripts/contracts.mjs";

function isDateTime(value) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/.exec(value);
  if (!match) return false;

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, offset] = match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const date = new Date(0);
  date.setUTCFullYear(year, month - 1, day);
  date.setUTCHours(hour, minute, second, 0);

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return false;
  }
  if (offset === "Z") return true;

  const [offsetHour, offsetMinute] = offset.slice(1).split(":").map(Number);
  return offsetHour <= 23 && offsetMinute <= 59;
}

test("evidence manifest schema requires reproducible inputs and honest check results", async () => {
  const schemaPath = path.join(uiRoot, "..", "docs", "evidence", "evidence-manifest.schema.json");
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  ajv.addFormat("date-time", { type: "string", validate: isDateTime });
  const validate = ajv.compile(schema);
  const manifest = {
    schemaVersion: 1,
    taskId: "M00-W04-T01",
    requirements: ["OSS-02"],
    architectureDecisions: ["ARC-14"],
    gates: ["milestone acceptance"],
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
  assert.equal(validate({ ...manifest, requirements: [] }), false);
  assert.equal(validate({ ...manifest, requirements: [" "] }), false);
  assert.equal(validate({ ...manifest, gates: [] }), false);
  assert.equal(validate({ ...manifest, architectureDecisions: ["\t"] }), false);
  assert.equal(validate({ ...manifest, inputs: [] }), false);
  assert.equal(validate({ ...manifest, expected: [] }), false);
  assert.equal(validate({ ...manifest, observed: [] }), false);
  assert.equal(validate({ ...manifest, limitations: [] }), false);
  assert.equal(validate({ ...manifest, reviewers: [] }), false);
  assert.equal(validate({ ...manifest, checks: [] }), false);
  assert.equal(validate({ ...manifest, recordedAt: "yesterday" }), false);
  for (const timestamp of [
    "2026-99-99T99:99:99+99:99",
    "2026-02-30T12:00:00Z",
    "2026-10-23T24:00:00Z",
    "2026-10-23T12:00:00+14:60",
  ]) {
    assert.equal(validate({ ...manifest, recordedAt: timestamp }), false, timestamp);
  }
  assert.equal(
    validate({
      ...manifest,
      reviewers: [
        {
          name: "Reviewer",
          role: "independent",
          status: "accepted",
          reviewedAt: "2026-02-30T12:00:00Z",
        },
      ],
    }),
    false,
    "review timestamps use an explicit ISO 8601 form",
  );
  assert.equal(
    validate({ ...manifest, checks: [{ ...manifest.checks[0], result: "pass" }] }),
    true,
    "the schema records result values; it does not infer that unavailable checks passed",
  );
});
