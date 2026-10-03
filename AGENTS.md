# Detew development guide

These instructions apply throughout this repository. Follow the human user's current instructions and any applicable higher-priority instructions. Read more-specific `AGENTS.md` files if they are introduced under a component directory. This file guides work against the active product foundation; it does not authorize external publication, messages, deployments, or scope expansion.

## Current state and source of truth

The repository currently contains product and development documents. The implementation layout in the architecture is proposed; crates, daemons, UI tooling, packages, and a validated lab are not present yet. Do not claim installation, protection, compatibility, performance, or completed milestones based on the documents.

Use these active documents:

1. [README.md](README.md): project entry point and actual stage.
2. [docs/PRD.md](docs/PRD.md): product scope, stable requirement IDs, quality targets, and release gates.
3. [docs/PRODUCT.md](docs/PRODUCT.md): normative policy, lifecycle, privacy, and UI/UX behavior.
4. [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): stack, dependency/privilege boundaries, schemas, runtime, and evidence gates.
5. [docs/CONTEXT.md](docs/CONTEXT.md): canonical domain vocabulary.
6. [docs/MILESTONES.md](docs/MILESTONES.md): sequencing, dependencies, work packages, requirement ownership, and task template.
7. [docs/tasks/README.md](docs/tasks/README.md): detailed task specifications, accepted-output dependencies, testing/evidence, labels, and GitHub crosswalk.
8. [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md): execution orchestration, live-state ownership, parallel work, review/integration, gate advancement, and run checkpoints.

The foundation documents above define product scope and development requirements. The research documents in `docs/open_research_*.md` provide technical background. Keep commercial product comparisons, inspiration names, and links out of product/development definitions. Actual open source dependencies, host documentation, and standards are appropriate technical references.

Requirements define outcomes; PRODUCT defines their meaning; ARCHITECTURE defines mechanisms; MILESTONES defines order; DEVELOPMENT coordinates execution and handoffs. Resolve a discrepancy by updating the affected documents together and recording the consequence before implementing contradictory behavior. A selected technology remains subject to its validation gates. The proposed software license is not enacted merely because it appears in a document; resolve it through M00 before implementation contributions/distribution. Never infer dataset permissions from download availability.

## Starting and completing work

- Inspect `git status` and applicable instructions first. Preserve unrelated changes, moves, and untracked work. Search with `rg`/`rg --files`; read the relevant foundation sections before starting work.
- Follow [DEVELOPMENT](docs/DEVELOPMENT.md) for an authorized execution run: inspect the latest checkpoint/live issues, select eligible work, assign an owner/reviewer and bounded brief, validate/review/integrate the outcome, and record the next action. Preserve independent review and gate ownership required by the selected task.
- Identify the milestone/work package, PRD IDs, PRODUCT anchors, ARC decisions, and unresolved gate/dependency inputs for the task. Use `Mxx-Wyy-Tzz` when creating task definitions; keep existing IDs stable.
- Select work from the task backlog and its dependency graph. A GitHub issue's ready label is a snapshot; verify accepted predecessor outputs, gate evidence, and current inputs before starting. T1/extension tasks remain deferred until selected scope and prerequisites are accepted.
- Task definition catalogs generate the Markdown/index/coverage views using `python3 docs/tasks/manage.py render`; validate them with its `validate` command. Keep changes aligned with the existing issue's acceptance and native dependencies rather than creating duplicate task IDs. Publication/reconciliation remains an explicitly authorized external write, not a routine validation side effect.
- Implement the requested reviewable outcome. Documentation planning does not authorize starting a later implementation milestone. Instantiate proposed folders/crates when the task needs them, not to create an appearance of progress.
- Do not treat a future gate as a reason to stop all useful work. Complete authorized independent work, but keep dependent implementation/support claims gated by the required evidence. Record missing inputs and failed experiments precisely.
- Keep scope, interface, acceptance, and validation explicit. Refine broad work packages into tasks using the milestone template. A feasibility task can conclude that a candidate fails; it must retain the evidence and decision.
- Before completion, run the checks appropriate to the change, inspect the diff, update affected docs/contracts/evidence, and report what changed, what was verified, and what remains unproven. Never mark a task/gate complete because a file exists or code compiles.
- For authorized parallel work, assign owned paths and a shared-interface owner, isolate or serialize overlapping edits, coordinate the native lab, and review/integrate each worker's result before task closure. Leave the [run checkpoint](docs/DEVELOPMENT.md#10-checkpoints-and-resumption) at handoffs or blockers.

## Product boundaries

Detew adds web/application filtering to OPNsense. Reuse native firewall, routing, NAT, authentication, ACL/session/CSRF, backup, and package/service mechanisms. Use site/device/profile/category/application terminology from CONTEXT; household use is a validation environment, not a separate edition or product boundary.

V1 requires flow-level category/application controls, including Adult content, Games, and AI services, beyond DNS-only filtering. IPv4 and IPv6 are required on the supported topology. No category/profile/device-count/API/schedule paywalls or mandatory cloud account belong in the required open product.

T1 TLS termination and later ecosystem modules have separate milestones/gates. Define their extension boundaries in V1, but do not add decryption, arbitrary packet-loop plugins, fleet management, high availability, or another firewall distribution to a V1 task without an explicit scope decision.

## Architecture and core consistency

- Keep Rust domain/policy libraries portable, forbid their unsafe code, and keep OPNsense, SQL, packet I/O, network calls, UI, and native classifier dependencies outside them. Concrete adapters depend inward; thin binaries assemble components.
- Use one canonical normalization, validator, evaluator, and schedule library for runtime, preview, tester, and replay. PHP/TypeScript boundary checks do not determine a separate effective policy. Do not replace missing server behavior with a frontend-only rule.
- Follow PRODUCT's explicit assignment/exception priorities, site guardrails, multi-label category behavior, required evidence dimensions, schedule/DST/clock rules, and temporary-override expiry. Exceptions cannot bypass guardrails, parser safety, failure behavior, or pf.
- Evaluate one immutable bundle/context per decision. Cache validity includes bundle, evidence, attribution, schedule/override state, and deadlines. Reconsider affected active and idle tracked flows; never reuse an old allow after invalidation at its next forwarding checkpoint.
- Keep native XML as the only desired-state authority. Daemons consume generated snapshots and do not rewrite `config.xml`. Serialize writes with expected revision under the mutation lock and durable revision reservation; restore/import is rebased intent.
- Keep draft, saved desired, preparing, mixed generation, confirmed applied, and failed/degraded states distinct. All required worker and reconsideration acknowledgments govern applied status. A running PID, saved revision, or artifact hash does not prove active coverage.
- Preserve last durably verified compatible bundles and explicit recovery. Rollback is a new validated activation with stated dependency versions. Scope/hook or classifier ABI changes are maintenance operations.
- Use stable domain IDs, versioned generated contracts, canonical artifact serialization, and decimal strings for revisions/generations/sequences/large counters. Backend semantic validation remains authoritative; reject unknown write fields and unsupported required capabilities.

## Packet, native, data, and privilege boundaries

Netmap and nDPI are preferred gated candidates; Divert is the packet comparison candidate. ARCH-G01/02 evidence selects supported implementations. Do not assume another engine's compatibility or Linux kernel behavior applies to FreeBSD. Prove pf ordering, reinjection, ownership, both directions, original-client attribution, IPv6, and each advertised failure action on exact host/NIC/topology versions.

Maintain bounded worker-owned flow/reassembly/classifier state and a narrow documented native shim. Never retain borrowed packet/ring memory beyond its lifetime or allow Rust unwinding across C. Review native allocations and unsafe lifetime/validity/error contracts. A shim inside the engine does not isolate native crashes into another process. Do not silently evict active blocked state and subsequently permit the same connection.

The packet path uses local admitted immutable indexes and bounded work. It never waits for SQL writes, reporting, downloads, UI, controller RPC, or remote categorization. Account for full peak memory, including active/candidate artifacts, native allocations, queues, and host headroom. Overload, provisional limits, evidence expiry, and actual engine failure remain separate observable states.

Treat packets, sources, archives, imports, URLs, local IPC, and frontend strings as untrusted. Validate peer credentials, methods, roles, shapes, sizes, references, quotas, artifact signatures/provenance, and compatibility. Privileged attachment/recovery uses fixed narrow host actions, typed IDs, explicit ownership, and tested detach/restoration; no arbitrary command/path bridge.

Keep software, classifier catalog, taxonomy, and category-data versions/licenses distinct. Private corrections remain separate from upstream data. Freshness determines label eligibility and triggers engine-local reconsideration even when the controller is down. A shared IP or reverse DNS is not authoritative unique-host evidence; ECH/GREASE/unsupported or hidden observations remain explicitly uncertain.

## Frontend quality and truthful UX

Use the selected locally built React/strict TypeScript/Vite stack within the native authenticated shell. Node is build tooling only. Use generated DTOs, typed native transport, TanStack server-state/pagination, local drafts, and Detew-wrapped accessible Radix primitives. Scope Tailwind/tokens/portals and omit global Preflight; protect the host shell's styles and navigation.

The UI should make filtering scope, decision reason, and confirmed change status easy to understand. Follow PRODUCT's five surfaces and complete workflows. Editing a switch changes a draft; it does not imply immediate enforcement. Preserve drafts on conflicts, operation identity across reconnects, and stale timestamps on failed refresh. Remove present-tense health claims when status is stale.

Design with real empty/loading/stale/error/read-only/conflict/partial-activation states, long hostnames, IPv6, multiple labels, and realistic paginated lists. Include English/pt-BR, host light/dark themes, narrow-screen triage, keyboard/focus, zoom/reflow, and reduced motion. Review visual type/spacing/alignment and complete interactions; screenshot polish alone is insufficient.

Policy verdict, confirmed enforcement outcome, metadata visibility, and end-to-end connection success are separate facts. Display missing evidence and activity gaps honestly. A simulated allow, an engine log, transport blocking, or a generic TLS identity must not become a claim of successful connection, universal filtering, fallback, or decrypted contents. Do not introduce certificate failures to show a branded HTTPS block page.

## Privacy and operational safety

Default to local bounded decision metadata with no packet/decrypted-body retention, automatic telemetry, crash upload, remote per-flow lookup, or browsing-record submission. Support collection disabled, retention/deletion, quotas, and visible loss intervals. Diagnostic/export/correction preparation requires a content/redaction preview and does not send the artifact anywhere.

Do not put real client activity, credentials, appliance backups, signing secrets, or future CA keys into public fixtures, logs, tests, screenshots, or ordinary diagnostics. Use synthetic/safely curated and licensed material. Optional key/trust backup is separate from configuration/history export.

Packet/lifecycle experiments run in the isolated lab with verified console recovery. Do not mutate a live household/organizational gateway as a convenient test environment without explicit authorization for that environment. Install packages disabled, show preflight/ownership conflicts, and restore only Detew-owned artifacts/settings. Advertise bypass/restrictive modes or management exemptions only where measured.

## Verification and evidence

There are no implementation check scripts yet. M00 must establish and document exact entry points and locks. Do not invent successful test results or assume a future npm script exists. Once available:

| Change | Required relevant evidence |
|---|---|
| Documentation | Local links/anchors, requirement/ARC/gate/work-package IDs, dependency/scoping consistency, and whitespace/diff review |
| Portable core/schema | Pinned Rust build/format/lints, independent semantic fixtures/replay/property tests, schema/TypeScript/native-model round trips and drift checks |
| UI | Strict types/lints, interaction tests and relevant browser journeys; host integration, accessibility/localization/responsive/visual checks |
| Packet/FFI | Pinned native FreeBSD build, hostile-input/native tests, real IPv4/IPv6 path and pf/reinjection/ownership/action/failure matrix |
| Control/data/storage | Concurrent edits, expiry, corrupted/oversized/malicious input, worker/restart/interrupted-write/disk-full/restore/rollback cases |
| Capacity/release | PRD reference/bypass/saturation/activation/soak/quality reports, package install/upgrade/removal, signatures/SBOM/software/data notices |

Use tests that express independent product expectations and observed outcomes. Do not write implementation-mirroring tests or expand test runs for a low-impact reversible edit without a concrete reason. Portable checks do not replace native kernel/packaging evidence, and mocks do not close independent usability/pilot gates.

Record exact revision/environment/input versions, commands/procedure, expected/observed results, limits, and reviewers using MILESTONES' evidence contract. Update the requirement ledger once created. Keep proposed targets separate from measured results. Final release acceptance needs all in-scope requirement evidence and actual maintenance/security/data-update ownership.

## Keeping the foundation connected

Apply the [synchronization table](docs/MILESTONES.md#81-ownership-and-update-triggers) whenever scope, semantics, technology, terminology, support, or sequencing changes. Preserve stable requirement/ARC/milestone/work-package IDs; keep file/heading links accurate after moves. CONTEXT is a glossary, not an implementation scratch pad. Do not add new ADR files for routine implementation choices; record consequential changes with rationale and evidence in the appropriate decision register.

Milestone exits update the plan with a dated evidence/revision record and README with the actual stage. Keep planned, implemented, tested, and supported distinct. Never silently weaken a correctness/privacy/status contract, discard a failed experiment, or mark a gate accepted to keep a preferred dependency.
