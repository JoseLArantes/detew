/* SPDX-License-Identifier: MIT */
import { spawnSync } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import { compile } from "json-schema-to-typescript";

export const uiRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
export const repoRoot = path.resolve(uiRoot, "..");

const schemaRelativePath = path.join("contracts", "schemas", "bootstrap-info.v1.json");
const typesRelativePath = path.join("ui", "src", "contracts", "generated", "bootstrap-info.ts");

function assertSchema(schema) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validate = ajv.compile(schema);
  const valid = validate({ component: "detew", stage: "not_enforcing" });
  if (!valid) {
    throw new Error(`Valid bootstrap fixture rejected: ${ajv.errorsText(validate.errors)}`);
  }

  const invalid = validate({ component: "detew", stage: "not_enforcing", active: true });
  if (invalid) {
    throw new Error("Closed bootstrap schema accepted an unknown property");
  }
}

function runSchemaGenerator(destination) {
  const result = spawnSync(
    "cargo",
    ["run", "--locked", "--quiet", "--package", "detew-schema-gen", "--", destination],
    { cwd: repoRoot, encoding: "utf8" },
  );
  if (result.status !== 0) {
    throw new Error(
      `Rust schema generation failed (${result.status ?? "signal"}).\n${result.stdout}${result.stderr}`,
    );
  }
}

export async function renderContracts(destinationRoot) {
  const schemaPath = path.join(destinationRoot, schemaRelativePath);
  const typePath = path.join(destinationRoot, typesRelativePath);
  await mkdir(path.dirname(schemaPath), { recursive: true });
  await mkdir(path.dirname(typePath), { recursive: true });

  runSchemaGenerator(schemaPath);
  const schema = JSON.parse(await readFile(schemaPath, "utf8"));
  assertSchema(schema);
  const types = await compile(schema, "BootstrapInfo", {
    bannerComment: "/* Generated from the Rust bootstrap fixture. Do not edit by hand. */",
    style: { singleQuote: false },
  });
  await writeFile(typePath, types.endsWith("\n") ? types : `${types}\n`, "utf8");
  return { schemaPath, typePath };
}

export async function renderTemporaryContracts() {
  const tempRoot = await mkdtemp(path.join(os.tmpdir(), "detew-contracts-"));
  try {
    const paths = await renderContracts(tempRoot);
    return {
      schema: await readFile(paths.schemaPath),
      types: await readFile(paths.typePath),
      cleanup: () => rm(tempRoot, { recursive: true, force: true }),
    };
  } catch (error) {
    await rm(tempRoot, { recursive: true, force: true });
    throw error;
  }
}
