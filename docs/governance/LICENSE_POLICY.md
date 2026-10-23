# Software license and dependency admission policy

**Decision:** LIC-01 · MIT for Detew-owned material\
**Date:** October 2, 2026\
**Task:** [M00-W01-T01](../tasks/m00/M00-W01-T01.md) · [GitHub #1](https://github.com/JoseLArantes/detew/issues/1)\
**Project owner / licensing decision owner:** [JoseLArantes](https://github.com/JoseLArantes)\
**License text:** [LICENSE](../../LICENSE)\
**Inventory:** [Dependency register](DEPENDENCIES.md)\
**Validation:** [EV-M00-W01-T01](../evidence/m00/EV-M00-W01-T01.md)

## 1. License decision and ownership

JoseLArantes explicitly selected the MIT license for this project and requested its enactment in the repository. The copyright notice uses the supplied identity: `Copyright (c) 2026 JoseLArantes`. The repository is [JoseLArantes/detew](https://github.com/JoseLArantes/detew). No other legal name, organization, contact address, or copyright assignment is inferred.

The root LICENSE applies to original Detew software, project tooling, and documentation unless a file carries an explicit different notice. Third-party code, copied material, dependencies, datasets, and their license texts retain their respective terms and copyright notices. Future contributors retain copyright in their contributions and grant the project permission under the applicable contribution license; repository ownership does not transfer their copyright.

MIT permits use, modification, redistribution, sublicensing, and sale, subject to preserving its notice. It includes the standard warranty/liability disclaimer. Downstream recipients can distribute modified software under other terms while honoring the MIT conditions for included MIT material. Detew's commitment to publish its required components and avoid feature paywalls is the project's release policy, rather than an extra condition added to MIT. [OSI MIT text](https://opensource.org/license/mit), [SPDX MIT](https://spdx.org/licenses/MIT)

| Considered license | Decision |
|---|---|
| MIT | Selected by the project owner for a simple permissive license and broad reuse. Use SPDX identifier `MIT`. |
| Apache-2.0 | Permissive alternative with explicit patent provisions; not selected because the owner requested MIT. |
| GPL-3.0-or-later | Copyleft alternative with different downstream distribution obligations; not selected for Detew-owned material. |

Use the unmodified MIT terms. Do not add a noncommercial restriction, special business-use approval, attribution beyond the license, or a requirement to disclose all downstream modifications. Different terms for third-party components remain separately visible. [Apache-2.0 terms](https://www.apache.org/licenses/LICENSE-2.0), [GPL-3.0 terms](https://spdx.org/licenses/GPL-3.0-or-later.html)

The owner has accepted the MIT choice. This record defines the admission process; each actual dependency still requires its own evidence and approval. The [evidence report](../evidence/m00/EV-M00-W01-T01.md) distinguishes completed document checks from pending task review and integration.

## 2. Admission principles

Every new or materially changed dependency/source passes review before it enters a build, repository vendor directory, shipped artifact, baseline dataset, or accepted extension. A familiar package name, registry license field, download permission, or existing host installation is insufficient evidence.

Admission is specific to the exact version, files/features, use, and distribution route. Record transitive dependencies and material included through native builds, generated code, browser assets, archives, fixtures, and datasets. Review a version, feature, license, source, linkage, packaging, or use change again when it changes the recorded obligations.

Maintain separate records for:

- Detew-owned software and tooling: MIT.
- Rust and JavaScript software, including transitives and generated/bundled material.
- Native libraries, headers, adapters, and linked binaries.
- Build/test tools and their emitted or redistributed material.
- Host-provided software used by the plugin.
- Category/application data, signatures, public-suffix/timezone snapshots, fixtures, fonts, icons, and other assets.

## 3. License screening

This table defines review routing, not automatic compatibility approval.

| Terms | Default route |
|---|---|
| MIT, ISC, BSD-2-Clause, BSD-3-Clause, 0BSD, Apache-2.0 | Prefer for software where suitable. Verify exact texts, notices, additional files/terms, chosen dual-license option, and artifact obligations before admission. |
| LGPL or other limited/file-level copyleft | Conditional review of linked/copied/modified files, corresponding source, notices, replacement/relinking, and the exact distributed artifact. Record the applicable upstream terms separately. |
| GPL/AGPL components intended to be copied or linked into Detew | Hold admission until the maintainer records an exact combined-work analysis and compatible distribution plan. Inclusion that requires changing Detew-owned material's selected licensing policy needs an explicit owner decision. |
| GPL/AGPL build tools or separate programs | Assess actual use, modified/distributed code, generated output, and coupling. A build-tool label alone neither approves nor rejects a runtime dependency. |
| Data/asset licenses, public-domain statements, database/share-alike terms | Separate source-specific review of copying, modification, derivation, redistribution, attribution, access terms, and dataset combination. A software-license approval does not authorize data. |
| Missing, contradictory, custom, noncommercial, field-of-use, or paid-use restrictions | Keep unadmitted while unresolved. Restricted material cannot be required for Detew's open baseline. A maintainer exception cannot create permissions the upstream owner has not granted. |

For MIT material, preserve the upstream copyright and permission notice. BSD and Apache packages have their own notice/distribution requirements; Apache review includes any required NOTICE material and modified-file notices. Preserve SPDX `OR`/`AND`/`WITH` meaning and record which offered option is used. [MIT terms](https://spdx.org/licenses/MIT), [BSD-2-Clause terms](https://spdx.org/licenses/BSD-2-Clause.html), [Apache §4](https://www.apache.org/licenses/LICENSE-2.0)

### 3.1 Native classifier review

The reviewed nDPI source snapshot is `11f0e5ee52275e18135a163910c1eb2d2ad7bce3`. Its core license manifest states LGPLv3; the API header grants version 3 or later. Its additional components have separate revenue/use-based terms. Review per-file terms and enabled components rather than treating the entire checkout as one unrestricted library. [Pinned license manifest](https://github.com/ntop/nDPI/blob/11f0e5ee52275e18135a163910c1eb2d2ad7bce3/README.license.md), [pinned API header](https://github.com/ntop/nDPI/blob/11f0e5ee52275e18135a163910c1eb2d2ad7bce3/src/include/ndpi_api.h)

Only a demonstrably unrestricted open-source component set may enter the required baseline. The snapshot is a licensing observation, not a selected production revision or an admission. M02 must verify the chosen release's exact source/features/catalog, build dependencies, and artifact obligations. Required classification cannot depend on extra components restricted to non-revenue use. Missing legal or technical evidence keeps ARC-05/ARCH-G02 gated.

For an LGPL combined work, assess notices and license copies, modifications and source availability, users' ability to replace/relink the library, relevant header-derived material, and applicable installation information. Dynamic linking is a candidate mechanism to evaluate, not proof of compliance; static linking needs its own documented route. Keep Detew's original application code MIT and upstream library material under its own applicable license. [LGPLv3 §§2–4](https://spdx.org/licenses/LGPL-3.0-only.html)

### 3.2 Build tools and datasets

Review Rust/npm direct and transitive packages from exact locked inputs, including optional features and target-specific code. Review native source archives, headers, patches, and generated catalogs together. Inventory build/test tools separately; inspect outputs containing templates/runtime code and anything copied into release artifacts.

Data review records publisher and provenance, exact terms and snapshot, permitted access/copying/derivation/redistribution, attribution, modification/share-alike requirements, update channel, and private-data handling. Download access without redistribution rights stays unadmitted. User corrections stay separate from upstream data and require explicit reviewed submission; nothing is shared automatically. M03 owns source admission and category-data feasibility.

## 4. Admission checklist and decision

Apply the full checklist to a concrete dependency, data source, or asset proposal before it is included or distributed. Do not require a production admission package for absent future candidates; defer their exact version, file/feature, use, and artifact review until a task proposes them. M00-W02-T01 records the current bootstrap and build inputs and their applicable notice obligations. Reassess a current item when its version, included files/features, or distribution use materially changes.

The proposer prepares the [inventory fields](DEPENDENCIES.md#2-record-fields) and checks each item:

1. **Identify:** exact upstream/revision/archive digest, package/file set, features, source of truth, purpose, owner, and alternatives.
2. **Establish rights:** exact license texts and per-file exceptions, copyright/provenance, dual-license choice, dataset/access terms, and any unresolved conflict. Preserve immutable references and hashes.
3. **Map use:** repository copying, modification, static/dynamic linkage, generated output, build-only/host/runtime use, and every affected distribution artifact.
4. **Trace transitives:** resolve the complete shipped/build dependency and embedded-asset set from the chosen locks/build manifest. Record review gaps explicitly.
5. **Specify obligations:** notices/licenses, source/patches, NOTICE or attribution, relinking/replacement/installation materials where applicable, data derivation/share-alike, and which artifact carries each item.
6. **Check the technical boundary:** native/unsafe code, build scripts/network access, privileges, target support, resource behavior, maintenance and vulnerability handling. Link actual tests to the owning task; licensing approval alone establishes none of these.
7. **Decide:** named reviewer assesses the evidence; JoseLArantes or a named delegated maintainer records admission, rejection, or the remaining blocker, with date, scope, revision, evidence, and expiry/review triggers.
8. **Verify delivery:** source and binary/data artifacts carry the recorded material and only admitted components. Packaging/release tasks verify the actual payload, not just this checklist.

Use `proposed`, `under_review`, `admitted`, `blocked`, or `rejected` in the register. Partial rights or technical results do not admit an entire component set. Exceptions identify the affected component, reason, legal basis, limits, approver, and artifact obligations. Ambiguous rights remain blocked until resolved; required open capabilities and upstream rights cannot be waived by a local approval.

## 5. Contribution and notice responsibilities

Original contributions are submitted under the project's MIT terms; contributors retain their copyright. By submitting original work, a contributor confirms they have the right to submit it under those terms. Identify incorporated third-party material, its source, and applicable terms. Preserve required upstream notices and license texts. Work with unclear rights and data without redistribution permission cannot be accepted or bundled. No CLA or commit sign-off is required. The [contributor guide](../../CONTRIBUTING.md) defines the rights statement and provenance procedure.

Contributors own accurate provenance and proposed inventory changes. Reviewers check the license/use analysis and required evidence. Maintainers record decisions; package/release owners assemble and verify [third-party notices](../../THIRD_PARTY_NOTICES.md), license texts, source/patch material, and separate software/data manifests. A generated SPDX/SBOM record supports this process without replacing review.

For new Detew source/tooling files, use `SPDX-License-Identifier: MIT` in the language's comment syntax where practical; preserve upstream identifiers on imported material. Future package metadata uses `MIT` for Detew-owned packages. A combined artifact's metadata and notice bundle must reflect all of its components.

## 6. Connected obligations

- [PRD governance](../PRD.md#14-open-source-sustainability-and-governance) and OSS-01–03 define the required open release outcomes.
- [PRODUCT stack decision](../PRODUCT.md#23-technology-baseline-and-integration-gates) and [ARCHITECTURE dependency policy](../ARCHITECTURE.md#23-dependency-and-version-policy) consume this decision.
- [M00-W01-T02](../tasks/m00/M00-W01-T02.md) owns complete contributor/notice integration and clean-checkout acceptance. The owner's current request explicitly authorizes creating LICENSE alongside T01.
- [M00-W01-T03](../tasks/m00/M00-W01-T03.md) still owns the verified private security-reporting route; this license work does not invent a contact or mark that task complete.
- [M02](../MILESTONES.md#m02-packet-and-classifier-feasibility), [M03](../MILESTONES.md#m03-category-data-feasibility-and-baseline-artifacts), and release tasks perform exact native/software/data and final artifact admission.

Changes to this decision follow the [foundation synchronization rules](../MILESTONES.md#81-ownership-and-update-triggers), with the licensing decision owner recording the consequence before changed licensing is applied.
