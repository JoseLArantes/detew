/* SPDX-License-Identifier: MIT */
import { readFile } from "node:fs/promises";
import path from "node:path";
import { renderTemporaryContracts, uiRoot } from "./contracts.mjs";

const committedSchemaPath = path.join(
  uiRoot,
  "..",
  "contracts",
  "schemas",
  "bootstrap-info.v1.json",
);
const committedTypesPath = path.join(uiRoot, "src", "contracts", "generated", "bootstrap-info.ts");
const generated = await renderTemporaryContracts();

try {
  const [committedSchema, committedTypes] = await Promise.all([
    readFile(committedSchemaPath),
    readFile(committedTypesPath),
  ]);
  if (!generated.schema.equals(committedSchema)) {
    throw new Error("Generated JSON Schema differs from contracts/schemas/bootstrap-info.v1.json");
  }
  if (!generated.types.equals(committedTypes)) {
    throw new Error(
      "Generated TypeScript differs from ui/src/contracts/generated/bootstrap-info.ts",
    );
  }
  console.log("Generated schema and TypeScript DTO match committed output.");
} finally {
  await generated.cleanup();
}
