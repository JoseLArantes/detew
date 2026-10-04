# Dependency and source register

**Policy:** [License and dependency admission](LICENSE_POLICY.md)\
**Maintainer:** JoseLArantes\
**Baseline:** October 2, 2026

## 1. Current admission state

The repository contains planning documents and the backlog management helper. Product crates, npm/native packages, vendored libraries, category datasets, and release artifacts are not present. The architecture's selections are candidates subject to exact-version licensing and technical admission. No entry below represents an admitted production dependency or a completed SBOM.

| Candidate / family | Inventory class | License-review state and next evidence |
|---|---|---|
| nDPI core and chosen classifier catalog | Native runtime / headers / catalog | `blocked`: reviewed source observation uses LGPLv3-or-later in the API header; additional restricted components excluded from the required baseline. Pin the production file/feature set and prove obligations and ARCH-G02 results. |
| Netmap or selected packet adapter | Native runtime / host | `proposed`: exact adapter/host source, per-file rights, linkage, and ARCH-G01 decision needed. |
| OPNsense / FreeBSD host-provided components | Host | `proposed`: identify exact consumed components, copied templates/helpers, dependencies and notices; host presence is not approval to copy/relicense them. |
| Rust crates in ARCHITECTURE §2.1 | Software runtime / transitives | `proposed`: exact lock/features/targets, upstream terms, native/build-script dependencies, and tests needed. |
| React and other UI packages in ARCHITECTURE §2.2 | Software / browser assets / transitives | `proposed`: production locks and complete bundle inventory needed. React's pinned MIT text was reviewed as a checklist example only. |
| Rust, Node/npm, UI test/build tools, gh/Python helper execution | Build/test/development | `proposed`: exact toolchain/tool records and redistributed/generated-material review needed; these tools are not bundled as product runtime by this record. |
| Category lists, application signatures, fixtures and corrections | Data | `proposed`: no baseline sources admitted. M03 must review source rights/provenance separately and establish lawful redistribution/update paths. |
| Public-suffix/timezone snapshots, fonts/icons and other assets | Data / assets / embedded package material | `proposed`: pin each included source and review its license/attribution/derivation obligations separately. |

The nDPI licensing observation uses commit `11f0e5ee52275e18135a163910c1eb2d2ad7bce3`; exact references/hashes are in the [source review manifest](../evidence/m00/license-sources.json). It is not a production pin. The React example uses the v19.2.0 license snapshot and does not admit React or its transitive graph.

## 2. Record fields

Create an individual record before admitting a dependency/source. Keep software, native/build tools, host use, data, and assets independently traceable; one family row above does not replace per-component records.

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
