// SPDX-License-Identifier: MIT
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const header = [
  "requirement_id",
  "scope",
  "primary_milestone",
  "task_ids",
  "implementation_revision",
  "evidence_ids",
  "status",
  "owner",
  "limitations",
];

function fail(message) {
  throw new Error(`Requirement ledger: ${message}`);
}

function csvRow(values) {
  return values
    .map((value) => {
      const text = String(value ?? "");
      return /[",\r\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text;
    })
    .join(",");
}

export function parseCsv(source) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      if (row.some((value) => value.length > 0)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  if (quoted) fail("CSV contains an unterminated quoted field");
  if (field.length > 0 || row.length > 0) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

function expandRequirementTokens(text) {
  const expanded = [];
  const tokenPattern = /([A-Z]{2,3})-(\d{2})(?:[–-](\d{2}))?/g;
  for (const [, prefix, startText, endText] of text.matchAll(tokenPattern)) {
    const start = Number(startText);
    const end = Number(endText ?? startText);
    if (end < start) fail(`invalid requirement range ${prefix}-${startText}–${endText}`);
    for (let number = start; number <= end; number += 1) {
      expanded.push(`${prefix}-${String(number).padStart(2, "0")}`);
    }
  }
  return expanded;
}

function collectPrdRequirements(prd) {
  const requirements = new Map();
  for (const [, id, scope] of prd.matchAll(/^\|\s*([A-Z]{2,3}-\d{2})\s*\|\s*(V1|T1|E)\s*\|/gm)) {
    if (requirements.has(id)) fail(`${id} appears more than once in PRD.md`);
    requirements.set(id, { id, scope });
  }
  return requirements;
}

function collectPrimaryMilestones(milestones) {
  const rows = milestones.split(/\r?\n/);
  const start = rows.findIndex((line) => /^\|\s*Requirement IDs\s*\|\s*Scope\s*\|\s*Primary milestone\s*\|/.test(line));
  if (start < 0) fail("the requirement ownership table is missing from MILESTONES.md");

  const owners = new Map();
  for (let index = start + 2; index < rows.length && rows[index].startsWith("|"); index += 1) {
    const cells = rows[index].split("|").slice(1, -1).map((cell) => cell.trim());
    if (cells.length < 4 || !/^(V1|T1|E)$/.test(cells[1])) continue;
    const [, scope, primaryMilestone] = cells;
    if (!/^M\d{2}$/.test(primaryMilestone)) continue;
    for (const id of expandRequirementTokens(cells[0])) {
      if (owners.has(id)) fail(`${id} has more than one primary milestone`);
      owners.set(id, { scope, primaryMilestone });
    }
  }
  return owners;
}

function collectPlannedTasks(coverage) {
  const tasksByRequirement = new Map();
  for (const [, id, scope, taskCell] of coverage.matchAll(/^\|\s*([A-Z]{2,3}-\d{2})\s*\|\s*(V1|T1|E)\s*\|\s*(.*?)\s*\|/gm)) {
    if (tasksByRequirement.has(id)) fail(`${id} appears more than once in COVERAGE.md`);
    tasksByRequirement.set(id, {
      scope,
      tasks: [...new Set([...taskCell.matchAll(/M\d{2}-W\d{2}-T\d{2}/g)].map(([task]) => task))],
    });
  }
  return tasksByRequirement;
}

export function deriveExpectedRequirements(prd, milestones, coverage) {
  const requirements = collectPrdRequirements(prd);
  const owners = collectPrimaryMilestones(milestones);
  const plannedTasks = collectPlannedTasks(coverage);
  const counts = { V1: 0, T1: 0, E: 0 };
  const expected = [];

  for (const { id, scope } of requirements.values()) {
    const owner = owners.get(id);
    const plan = plannedTasks.get(id);
    if (!owner) fail(`${id} has no primary milestone in MILESTONES.md`);
    if (!plan) fail(`${id} has no planned task in COVERAGE.md`);
    if (owner.scope !== scope) fail(`${id} scope differs between PRD.md and MILESTONES.md`);
    if (plan.scope !== scope) fail(`${id} scope differs between PRD.md and COVERAGE.md`);
    if (plan.tasks.length === 0) fail(`${id} has no linked task ID in COVERAGE.md`);
    counts[scope] += 1;
    expected.push({
      requirement_id: id,
      scope,
      primary_milestone: owner.primaryMilestone,
      task_ids: plan.tasks.join(";"),
    });
  }

  for (const id of owners.keys()) if (!requirements.has(id)) fail(`${id} is stale in MILESTONES.md`);
  for (const id of plannedTasks.keys()) if (!requirements.has(id)) fail(`${id} is stale in COVERAGE.md`);
  if (requirements.size !== 84 || counts.V1 !== 73 || counts.T1 !== 7 || counts.E !== 4) {
    fail(`expected 84 requirements (73 V1, 7 T1, 4 E); found ${requirements.size} (${counts.V1} V1, ${counts.T1} T1, ${counts.E} E)`);
  }
  return { expected, counts };
}

export function validateRows(rows, expected) {
  if (rows.length === 0) fail("CSV is empty");
  if (rows[0].join(",") !== header.join(",")) fail("CSV header does not match the required evidence fields");

  const indexes = new Map(header.map((name, index) => [name, index]));
  const actual = new Map();
  for (const row of rows.slice(1)) {
    if (row.length !== header.length) fail(`row has ${row.length} columns; expected ${header.length}`);
    const id = row[indexes.get("requirement_id")];
    if (actual.has(id)) fail(`${id} appears more than once in requirements.csv`);
    actual.set(id, row);
  }

  const expectedById = new Map(expected.map((item) => [item.requirement_id, item]));
  for (const id of expectedById.keys()) if (!actual.has(id)) fail(`${id} is missing from requirements.csv`);
  for (const id of actual.keys()) if (!expectedById.has(id)) fail(`${id} is stale in requirements.csv`);

  for (const [id, row] of actual) {
    const expectedRow = expectedById.get(id);
    const value = (field) => row[indexes.get(field)];
    for (const field of ["scope", "primary_milestone", "task_ids"]) {
      if (value(field) !== expectedRow[field]) fail(`${id} has stale ${field}`);
    }
    if (value("status") !== "unverified") fail(`${id} must start with unverified status`);
    for (const field of ["implementation_revision", "evidence_ids", "owner"]) {
      if (value(field) !== "") fail(`${id} must not invent ${field}`);
    }
    if (value("limitations") !== "No accepted implementation evidence recorded.") {
      fail(`${id} must state that accepted implementation evidence is not yet recorded`);
    }
  }
  return true;
}

export function validateLedgerText(source, expected) {
  return validateRows(parseCsv(source), expected);
}

export function generateLedger(expected) {
  const lines = [header];
  for (const requirement of expected) {
    lines.push([
      requirement.requirement_id,
      requirement.scope,
      requirement.primary_milestone,
      requirement.task_ids,
      "",
      "",
      "unverified",
      "",
      "No accepted implementation evidence recorded.",
    ]);
  }
  return `${lines.map(csvRow).join("\n")}\n`;
}

function loadExpected() {
  return deriveExpectedRequirements(
    fs.readFileSync(path.join(root, "docs/PRD.md"), "utf8"),
    fs.readFileSync(path.join(root, "docs/MILESTONES.md"), "utf8"),
    fs.readFileSync(path.join(root, "docs/tasks/COVERAGE.md"), "utf8"),
  );
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const { expected, counts } = loadExpected();
  const outputPath = path.join(root, "docs/evidence/requirements.csv");
  if (process.argv.includes("--write")) {
    fs.writeFileSync(outputPath, generateLedger(expected));
    process.stdout.write(`Wrote ${expected.length} requirement rows to docs/evidence/requirements.csv.\n`);
  } else {
    validateLedgerText(fs.readFileSync(outputPath, "utf8"), expected);
    process.stdout.write(`Requirement ledger matches ${expected.length} requirements (${counts.V1} V1, ${counts.T1} T1, ${counts.E} E).\n`);
  }
}
