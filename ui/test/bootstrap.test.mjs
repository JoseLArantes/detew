/* SPDX-License-Identifier: MIT */
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import Ajv2020 from "ajv/dist/2020.js";
import { uiRoot } from "../scripts/contracts.mjs";

test("bootstrap contract accepts only the closed fixture shape", async () => {
  const schemaPath = path.join(uiRoot, "..", "contracts", "schemas", "bootstrap-info.v1.json");
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);

  assert.equal(validate({ component: "detew", stage: "development_only" }), true);
  assert.equal(validate({ component: "detew", stage: "not_enforcing", status: "active" }), false);
  assert.equal(validate({ component: "detew", stage: "unknown" }), false);
});
