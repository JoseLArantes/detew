/* SPDX-License-Identifier: MIT */
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validateFixtureManifest } from "./fixture-manifest.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const count = await validateFixtureManifest(path.join(repoRoot, "fixtures", "manifest.json"));
console.log(`Fixture manifest valid (${count} synthetic fixture${count === 1 ? "" : "s"}).`);
