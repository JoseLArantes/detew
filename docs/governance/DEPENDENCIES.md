# Dependency and source register

**Policy:** [License and dependency admission](LICENSE_POLICY.md)\
**Maintainer:** JoseLArantes\
**Baseline:** October 23, 2026

## 1. Current admission state

The repository contains a portable Rust workspace and a local React/Vite development preview with exact lockfiles. M00-W02-T01 records the versions and must complete the license/notice inventory for dependencies and build inputs currently present, including any applicable artifacts. Those bootstrap inputs are not thereby admitted for a future production package. No packet adapter, native classifier, category dataset, SQLite implementation dependency, or release artifact is present. Do not treat absent future candidates as blocked work or require a production SBOM for them yet; review the exact component/version/files/features/use and artifact obligations when an implementation task proposes them. See [M00-W02 evidence](../evidence/m00/EV-M00-W02-T01.md) for the current bootstrap inventory and remaining review boundary.

| Candidate / family | Inventory class | License-review state and next evidence |
|---|---|---|
| nDPI core and chosen classifier catalog | Native runtime / headers / catalog | `deferred`: reviewed source observation uses LGPLv3-or-later in the API header; additional restricted components excluded from the required baseline. Pin the production file/feature set and prove obligations and ARCH-G02 results when the classifier task proposes a concrete release/use. |
| Netmap or selected packet adapter | Native runtime / host | `deferred`: exact adapter/host source, per-file rights, linkage, and ARCH-G01 decision are reviewed when a concrete candidate is proposed. |
| OPNsense / FreeBSD host-provided components | Host | `proposed`: identify exact consumed components, copied templates/helpers, dependencies and notices; host presence is not approval to copy/relicense them. |
| Bootstrap Rust crates (`Cargo.lock`) | Scaffold runtime / transitives | `under_review`: exact lock and package license metadata are recorded; current source/build notice obligations and target/feature scope are being inventoried. Production appliance inclusion needs its own artifact-specific review. |
| React/Vite/TypeScript/Ajv and UI tools (`ui/package-lock.json`) | Local preview/build/test | `under_review`: exact lock is recorded; optional platform packages, emitted browser output, and applicable notices are reviewed for the current use. Host integration/redistribution needs its own artifact-specific review. |
| Rust 1.99.1, Node 24.22.1, npm 11.19.1, shell/OS tools | Build/test | `under_review`: exact current build inputs are pinned for reproducibility; emitted/redistributed material and supported contributor environments are recorded separately. |
| SQLite activity-store implementation | Future runtime design | `deferred`: architecture selects the design and a conditional WAL-reset security floor, but no concrete SQLite package/version or implementation input exists in the bootstrap. The owning implementation task must complete exact rights, notice, and artifact review before inclusion. |
| Category lists, application signatures, fixtures and corrections | Data | `proposed`: no baseline sources admitted. M03 must review source rights/provenance separately and establish lawful redistribution/update paths. |
| Public-suffix/timezone snapshots, fonts/icons and other assets | Data / assets / embedded package material | `proposed`: pin each included source and review its license/attribution/derivation obligations separately. |

The nDPI licensing observation uses commit `11f0e5ee52275e18135a163910c1eb2d2ad7bce3`; exact references/hashes are in the [source review manifest](../evidence/m00/license-sources.json). It is not a production pin. The React example uses the v19.2.0 license snapshot and does not admit React or its transitive graph.

## 2. Record fields

Create an individual record before admitting a concrete dependency/source. Keep software, native/build tools, host use, data, and assets independently traceable; one family row above does not replace per-component records. Do not create speculative production records for absent future candidates; their full review starts when a task proposes exact components and use.

| Field | Required content |
|---|---|
| Identity | Stable record ID, name, ecosystem, class, purpose, proposing owner. |
| Source | Upstream/publisher, exact version/commit, artifact URL and digest, included files/features/targets. |
| Rights | SPDX expression or documented custom terms, exact text URLs/snapshots/digests, copyright holders, exceptions, dual-license option used. |
| Use | Copied/modified/generated, static/dynamic linked, build-only, host-provided, runtime or data use; each affected artifact. |
| Transitives | Reviewed locked/native/embedded dependency set and any remaining gaps. |
| Obligations | Notice/license/attribution locations, source/patch/relinking materials where relevant, data derivation/redistribution/combination terms. |
| Technical review | Build/network/native/privilege behavior, target support, maintenance/security handling, relevant test/evidence identities. |
| Decision | Status, named reviewer and approving maintainer, date, rationale, scope/conditions, exceptions or unresolved blocker. |
| Maintenance | Update owner/channel, vulnerability response, license-change triggers, review date and removal/rollback plan. |

For data records, additionally capture access/download terms, permitted copying/modification/redistribution, provenance, freshness and maintenance, attribution, database/share-alike conditions, privacy constraints, and whether the reviewed material is eligible for the baseline, private corrections, or optional import only.

## 3. Approval and release use

The status and approval workflow are defined by [policy §4](LICENSE_POLICY.md#4-admission-checklist-and-decision). A missing license, unresolved rights, incomplete file/feature inventory, or missing mandatory technical result keeps the component unadmitted. A new version/use/feature can invalidate the existing decision and requires reassessment.

As M00/M02/M03 establish exact inputs, replace the relevant family placeholder with individual reviewed records. Build/native manifests and the final SBOM use those identities and digests. Release tasks compare them with the actual delivered software, data, notice, license, and source payload. Keep proposed, reviewed, admitted, bundled, and tested states explicit.
