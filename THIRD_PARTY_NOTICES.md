# Third-party notices

Detew-owned software, project tooling, and documentation use the [MIT license](LICENSE), with the original project copyright notice `Copyright (c) 2026 JoseLArantes`. Material carrying an explicit different notice retains its own terms.

This is the notice framework for the source repository, not a release notice bundle. Current Rust and UI dependencies have bootstrap-scoped review in [EV-M00-W02-T01](docs/evidence/m00/EV-M00-W02-T01.md); no production dependency admission is claimed. The local generated UI preview is ignored and is not distributed. No classifier binary/catalog, vendored library, baseline category dataset, or release package is present. Separately installed toolchains and tools are not thereby bundled with Detew.

The [dependency register](docs/governance/DEPENDENCIES.md) distinguishes current bootstrap inputs, proposed components, and admitted product inputs. The [admission policy](docs/governance/LICENSE_POLICY.md) governs each actual inclusion. Public standard license texts and source links used in review do not admit the referenced implementation.

## When a component is included

Record its name/version/source/digest, included file or artifact, copyright holder, exact license, modifications, and upstream notice text. Include required license copies, attribution/NOTICE material, corresponding source/patches, and replacement/relinking information where applicable. Preserve the original terms and identify which software or data artifact carries each obligation.

Track software/native/build dependencies separately from datasets, signatures, assets, and fixture sources. Do not describe all upstream material or a combined binary as MIT merely because Detew's own source is MIT. Package/release tasks generate and verify notices from the actual admitted artifact inventory, including transitives and embedded/generated material.
