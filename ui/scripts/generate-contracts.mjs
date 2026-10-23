/* SPDX-License-Identifier: MIT */
import path from "node:path";
import { renderContracts, uiRoot } from "./contracts.mjs";

await renderContracts(path.join(uiRoot, ".."));
console.log("Generated Rust schema and TypeScript DTO.");
