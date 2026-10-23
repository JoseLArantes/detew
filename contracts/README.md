<!-- SPDX-License-Identifier: MIT -->

# Bootstrap contract fixture

`schemas/bootstrap-info.v1.json` and `ui/src/contracts/generated/bootstrap-info.ts` are generated from the deliberately small Rust fixture in `crates/detew-domain`. They exercise the pinned Rust → JSON Schema 2020-12 → TypeScript pipeline; they are not product API contracts.

After installing the pinned UI development dependencies, run `npm run contracts:generate` from `ui/` to refresh both files. Run `npm run contracts:check` to regenerate into a temporary directory and fail if either committed output differs. Ajv's dedicated 2020-12 implementation validates the emitted schema. M01 must revisit the generator subset against its real contract constructs before expanding this fixture.
