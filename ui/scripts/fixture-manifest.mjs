/* SPDX-License-Identifier: MIT */
import { createHash } from "node:crypto";
import { readFile, realpath } from "node:fs/promises";
import path from "node:path";

const prohibitedMarker =
  /(?:DETEW-SYNTHETIC-SECRET:|(?:password|token|api[_-]?key)\s*[=:]\s*[^\s"']+)/i;
const allowedKinds = new Set(["synthetic", "licensed_public"]);

export async function validateFixtureManifest(manifestPath) {
  const absoluteManifestPath = await realpath(manifestPath);
  const repoRoot = await realpath(path.resolve(path.dirname(absoluteManifestPath), ".."));
  const manifest = JSON.parse(await readFile(absoluteManifestPath, "utf8"));
  if (manifest.schemaVersion !== 1 || !Array.isArray(manifest.fixtures)) {
    throw new Error("Fixture manifest must use schemaVersion 1 and a fixtures array");
  }

  const ids = new Set();
  for (const fixture of manifest.fixtures) {
    if (typeof fixture.id !== "string" || !fixture.id.trim() || ids.has(fixture.id)) {
      throw new Error("Fixture IDs must be unique non-empty strings");
    }
    ids.add(fixture.id);
    if (!allowedKinds.has(fixture.kind)) {
      throw new Error(`${fixture.id}: fixture kind must be synthetic or licensed_public`);
    }
    if (
      fixture.redistribution !== true ||
      typeof fixture.license !== "string" ||
      !fixture.license.trim()
    ) {
      throw new Error(`${fixture.id}: redistribution permission and an exact license are required`);
    }
    if (typeof fixture.provenance !== "string" || !fixture.provenance.trim()) {
      throw new Error(`${fixture.id}: provenance is required`);
    }
    if (!/^[a-f0-9]{64}$/.test(fixture.sha256 ?? "")) {
      throw new Error(`${fixture.id}: expected a lowercase SHA-256 digest`);
    }
    if (typeof fixture.path !== "string" || path.isAbsolute(fixture.path)) {
      throw new Error(`${fixture.id}: fixture path must be relative to the repository`);
    }

    const filePath = await realpath(path.resolve(repoRoot, fixture.path));
    if (filePath !== repoRoot && !filePath.startsWith(`${repoRoot}${path.sep}`)) {
      throw new Error(`${fixture.id}: fixture path escapes the repository`);
    }
    const contents = await readFile(filePath);
    const actualDigest = createHash("sha256").update(contents).digest("hex");
    if (actualDigest !== fixture.sha256) {
      throw new Error(`${fixture.id}: fixture digest mismatch`);
    }
    if (prohibitedMarker.test(contents.toString("utf8"))) {
      throw new Error(`${fixture.id}: prohibited credential-like marker found`);
    }
  }
  return manifest.fixtures.length;
}
