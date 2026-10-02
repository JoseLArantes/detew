# Detew — Product Requirements Document

**Version:** 0.1 · Proposed development baseline  
**Date:** October 2, 2026  
**Product:** Detew  
**Initial distribution:** OPNsense plugin  
**Companion:** [Product definition and implementation contracts](PRODUCT.md)  
**Implementation baseline:** [Architecture and stack](ARCHITECTURE.md)\
**Delivery plan:** [Development milestones](MILESTONES.md)\
**Development guide:** [AGENTS.md](../AGENTS.md)\
**Vocabulary:** [Domain language](CONTEXT.md)

This document defines Detew's product requirements. Nothing here implies that an engine, integration, dataset, or interface has already been implemented or validated. “Must” defines intended release acceptance; targets remain unmeasured until a release report supplies evidence.

## Contents

- [Product definition](#1-product-definition)
- [Problem, evidence, and gaps](#2-problem-evidence-and-relevant-gaps)
- [Users and scenarios](#3-users-and-primary-scenarios)
- [Scope and release boundaries](#4-scope-and-release-boundaries)
- [Inspection requirements](#5-inspection-and-filtering-requirements)
- [Category and application data](#6-category-and-application-data-requirements)
- [Policy consistency](#7-policy-and-consistency-requirements)
- [OPNsense and operations](#8-opnsense-integration-and-operations)
- [UI and experience](#9-ui-and-experience-requirements)
- [Security, privacy, and open source](#10-security-privacy-and-open-source-requirements)
- [Quality targets](#11-quality-targets-and-workload-definition)
- [Release gates](#12-release-plan-and-gates)
- [Verification](#13-verification-matrix)
- [Governance](#14-open-source-sustainability-and-governance)
- [Risks and decisions](#15-principal-risks-and-decision-register)
- [Success](#16-definition-of-success)

## 1. Product definition

**Detew is an open source web and application filtering platform that makes network access policies easy to configure, understand, and maintain.** It starts as an OPNsense plugin and adds flow-aware inspection, category controls, application controls, and explanations to an existing firewall.

Its first practical job is straightforward: an administrator selects devices or a network, blocks categories such as Adult content, Games, or AI services, and can see what happened and why. The same policy core must support a household, a small business, a school, or a managed organizational network without separate editions or artificial feature limits.

Detew extends OPNsense with an integrated content-policy and inspection layer. OPNsense remains responsible for the underlying firewall, routing, VPN, IDS/IPS, and administration. Classification coverage and supported inspection capabilities must be established through Detew's own validation and release evidence.

### 1.1 Product promise

1. **Useful filtering without a subscription.** Category selection, multiple profiles, device assignments, schedules, exceptions, application controls, and local explanations are part of the open source product.
2. **Consistent behavior.** A policy decision is reproducible from its recorded runtime bundle and evaluation context. Applying a change has an explicit outcome; saving a setting cannot masquerade as enforcement.
3. **Low learning cost.** Common tasks use plain language, safe defaults, and progressive disclosure. Advanced capabilities extend the same workflow.
4. **Honest visibility.** The product explains what it recognized, what it inferred, and what it could not inspect. Encrypted traffic is not described as decrypted unless it was terminated by the optional inspection module.
5. **An extensible foundation.** Classification providers, category datasets, identity connectors, platform adapters, and optional inspection modules have defined boundaries. Modularity does not require a cluster or a service for every feature.
6. **Local autonomy and privacy.** The normal filtering path works from local policy and installed data, without a vendor account or a mandatory remote categorization service.

### 1.2 Positioning

| Dimension | Definition |
|---|---|
| Category | Open source network web and application filtering |
| Initial entry point | OPNsense users seeking configurable category and application controls |
| Initial validation environment | A real household with multiple devices and different filtering needs |
| Broader audience | Home administrators, small organizations, schools, and network/security teams |
| Distinctive value | Open feature availability, understandable decisions, policy consistency, and polished interaction |
| Deployment model | Local appliance plugin first; portable domain core and platform adapters |
| Economic model | Free software; optional support, managed operations, or hosted services may fund development |
| Product boundary | An additional filtering layer over an existing firewall |

“Home firewall” is not the product identity. Household use is an important proving ground for simplicity. Organizational requirements shape extension contracts and operational correctness, while fleet management and enterprise integrations arrive after the core is proven.

## 2. Problem, evidence, and relevant gaps

### 2.1 Observed user problem

The initiating user already operates OPNsense and wants to choose categories such as games, adult content, and AI services without a required subscription. Their current filtering setup falls short in feature availability, setup friction, and learning effort. This is direct evidence from one user, not market-size evidence.

The product hypothesis is that other OPNsense users share this need and would prefer a well-maintained open source inspection product. Validate that hypothesis through installations and repeated use before claiming a broad market opportunity.

### 2.2 Existing approaches

Existing open source components cover different parts of the filtering workflow. Detew aims to combine classification, policy administration, enforcement, and explanations into a maintained, coherent product.

| Approach | What exists | Implication for Detew |
|---|---|---|
| Flow-aware filtering | Protocol/application identification, web categories, local lookup, and decision reporting are separate capabilities. Metadata inspection and TLS termination provide different levels of visibility. | Integrate these capabilities through explicit policy and evidence contracts; validate Detew's own coverage and behavior. |
| OPNsense Unbound / BIND | DNS blocklists and response-policy/category-list mechanisms. | Useful supporting controls; DNS-only blocking does not satisfy this product's inspection requirement. |
| AdGuard Home | An open source DNS filtering product with client controls and known DNS-level limitations. | A strong usability/reference alternative for some users; it does not provide the proposed flow-level enforcement model. |
| OPNsense Suricata | IDS/IPS with signature-based traffic inspection and several capture modes. | Complementary security capability; category administration and a complete content-policy workflow remain separate jobs. |
| Squid / e2guardian approaches | Proxy-based filtering and, with suitable deployment, deeper HTTP/TLS visibility. OPNsense's plugin repository currently marks its Squid and OPNProxy packages as unmaintained. | Existing technology may be reusable, but maintenance and deployment friction must be assessed rather than assuming a current supported turnkey plugin. |
| nDPI | An open source DPI classification library. | A candidate classifier, not a category database, policy engine, or complete enforcement product. |

Sources: [OPNsense Unbound](https://docs.opnsense.org/manual/unbound.html#blocklists), [OPNsense BIND](https://docs.opnsense.org/manual/how-tos/bind.html), [AdGuard Home](https://github.com/AdguardTeam/AdGuardHome), [OPNsense IPS](https://docs.opnsense.org/manual/ips.html), [OPNsense plugin repository](https://github.com/opnsense/plugins), [e2guardian](https://github.com/e2guardian/e2guardian), [nDPI](https://github.com/ntop/nDPI). Documentation checked October 2, 2026; packaging and supported capabilities can change.

### 2.3 Gaps worth testing

- Freely selectable categories and application controls within a maintained OPNsense plugin.
- A low-friction path from installation to a useful policy, with no mandatory cloud account.
- One coherent model for devices, profiles, schedules, exceptions, and active sessions.
- Explanations that connect observed traffic to actual settings, rather than presenting an unexplained blocklist hit.
- Inspectable category provenance, contribution workflows, and visible data freshness.
- Extensibility that does not compromise local reliability or split capabilities into paid editions.

The hardest gap is **classification quality and continuing maintenance**. Publishing code does not produce a complete category database. Existing public datasets provide a starting point, but their category breadth, regional coverage, update cadence, and license conditions need measurement. The UT1 publisher, for example, exposes distinct Adult, Games, and AI categories with substantially different catalog sizes; that is evidence to investigate coverage, not proof of adequacy. [UT1 category data](https://dsi.ut-capitole.fr/blacklists/index_en.php)

### 2.4 Validation and stop conditions

Interview at least 10 OPNsense administrators across household and small-organization settings. Recruit at least five independent pilot sites after the founder's own environment. Record the products they use, their most important categories, deployment constraints, and reasons to keep or remove Detew.

Proceed to general availability only if pilots demonstrate successful setup, repeat use, and acceptable false blocks. Reassess the direction if lawful redistributable category data remains inadequate, packet integration is unreliable on common hardware, or users obtain the same outcome with substantially less effort from maintained alternatives. Publish these findings even if they narrow the intended scope.

## 3. Users and primary scenarios

### 3.1 User roles

| Role | Job | Typical constraints | First-release treatment |
|---|---|---|---|
| Network owner | Configure appropriate access for a set of devices | Limited filtering expertise; downtime affects everyone | Guided setup, reusable profiles, clear exceptions and recovery |
| Small-organization administrator | Apply different policies to staff, guests, or shared devices | Limited time; mixed managed/unmanaged clients | Assignments, schedules, audit history, reliable upgrades |
| Network/security operator | Understand and troubleshoot filtering | Many flows, existing firewall/IPS rules, delegated access | Searchable activity, exact reason codes, read-only access, diagnostics |
| Data or integration contributor | Improve classifications or integrate a source | Needs stable formats and safe validation | Documented provider and dataset contracts |
| Managed-network administrator | Inspect HTTPS at finer granularity | Trust distribution, incompatible apps, sensitive traffic | Optional TLS module after its separate readiness gate |

First release includes an administrator and a read-only viewer through OPNsense permissions. A distinct policy-editor role is a later extension. A person browsing the network is not automatically an authenticated Detew user.

### 3.2 Essential scenarios

**S-01 — Block a category.** An administrator creates a profile, selects Adult content, Games, and AI services, assigns it to a test device, previews the change, and applies it. A blocked connection produces a decision record with its category evidence and active profile.

**S-02 — Different access for different devices.** Shared devices and a work laptop use different profiles. Explicit assignment precedence resolves overlapping groups. Unknown devices receive the site's default profile.

**S-03 — Permit a legitimate exception.** A required service is blocked by a broad category. The administrator opens its activity record, creates a narrowly scoped allow exception, optionally sets an expiry, previews affected devices, and applies it. Site guardrails still apply.

**S-04 — Use a schedule.** Games are blocked during selected local-time periods. The UI displays the site's timezone and next transition. An already active game connection is reconsidered at the transition.

**S-05 — Explain a failure.** A device cannot reach a service. The administrator distinguishes a Detew block, an insufficiently classified connection, an inspection bypass, and a connection for which no Detew block was observed. The UI does not invent an OPNsense firewall diagnosis without evidence.

**S-06 — Handle encrypted traffic honestly.** A service uses TLS, QUIC, ECH, or a tunnel. Detew uses available evidence and the configured insufficient-classification policy. It displays reduced visibility; it never presents a hostname guess as full content inspection.

**S-07 — Stay useful while offline.** A dataset source is unavailable. Filtering continues with an installed dataset within its allowed freshness window; the UI reports age and the eventual expiry behavior.

**S-08 — Recover from an unsuccessful change.** A malformed policy, failed engine activation, or incompatible upgrade leaves a visible failure state and a usable recovery route. The administrator can return to the previous known-good configuration.

**S-09 — Managed TLS inspection, later.** An administrator explicitly enrolls selected devices, distributes trust, selects inspection scope, and verifies a test connection. Excluded, pinned, and unsupported traffic follows declared behavior. Decrypted payloads are not recorded by default.

## 4. Scope and release boundaries

### 4.1 First production release: V1

V1 must include:

- A packaged OPNsense plugin and a validated inline packet adapter on a published support matrix.
- Bidirectional flow tracking, bounded parsing/classification, and flow-level enforcement.
- Hostname-aware HTTP/TLS filtering and supported QUIC metadata inspection, with explicit unsupported states.
- Selectable web categories, including Adult content, Games, and AI services, backed by distributable local data.
- Application identification and controls for a documented application catalog, including tested gaming services and representative encrypted applications.
- Multiple profiles, device/group/network assignments, site guardrails, domain/application exceptions, schedules, and temporary overrides.
- Desired-versus-active configuration status, preview, safe activation, rollback, and active-flow reconsideration.
- Decision explanations, searchable local activity, data freshness, visibility diagnostics, and privacy controls.
- Observe and enforce modes, declared failure behavior, safe installation and removal, and recovery instructions.
- Public source, documentation, dependency/data licenses, release provenance, and a contribution path.

The absence of TLS termination in V1 limits its granularity; it does not reduce V1 to DNS filtering. V1 must inspect and control flows even when the client's resolver is not Detew's resolver, wherever usable traffic evidence exists.

### 4.2 Optional managed TLS module: T1

T1 is a separate, open source capability after V1. It enables finer URL/request controls for a defined set of managed-device protocols. It requires a trusted interception CA and explicit scope. Ship it only after trust handling, exclusions, protocol behavior, privacy, and failure recovery are validated.

T1 is not an enterprise license tier. It is a risk and readiness boundary. Design the V1 module interface so it can provide request evidence and enforcement without changing the profile model.

### 4.3 Later extensions: E

Candidate extensions include identity connectors, richer security feeds, delegated policy editing, external event export, fleet operations, additional platform adapters, coordinated failover, and advanced classification. Their contracts should fit the core, but their implementations are outside V1.

A separate firewall distribution remains a possible future product decision, not a hidden commitment in this roadmap.

### 4.4 Explicit non-goals

- Reimplementing OPNsense's routing, NAT, VPN, basic packet firewall, authentication, or package manager.
- Universal decryption or a guarantee that all encrypted applications can be categorized.
- Distinguishing every video, message, prompt, image, or page within an encrypted shared platform in V1.
- Preventing determined circumvention on fully user-controlled devices or paths that do not cross the gateway.
- Claiming general malware prevention, DLP, identity-based zero trust, or certified enterprise security from category filtering alone.
- Running Kubernetes on the appliance or requiring distributed services for a single site.
- Unrestricted third-party code inside the V1 packet loop.
- Requiring optional hosted reputation queries or paid data to satisfy the base product promise.

## 5. Inspection and filtering requirements

Scope column: **V1** is required for the first production release; **T1** is required when shipping the TLS module; **E** is a later extension. Requirement IDs are stable and must appear in implementation tickets and release evidence.

| ID | Scope | Requirement and acceptance condition |
|---|---|---|
| INS-01 | V1 | Observe both directions of supported flows and enforce at the documented inspection point. Prove that selected test paths pass through the engine; an installed but unattached engine is not “protecting.” |
| INS-02 | V1 | Parse supported HTTP host information and TLS ClientHello metadata; identify absent, malformed, or hidden destination evidence explicitly. Do not depend exclusively on DNS observations. |
| INS-03 | V1 | Classify supported QUIC Initial traffic where metadata is available. Maintain protocol-version tests; unsupported or ECH-hidden traffic enters the declared visibility/fallback state. |
| INS-04 | V1 | Recognize applications through a versioned classifier catalog and evidence types. Publish supported applications and accuracy results; do not imply that a library's entire advertised catalog has been validated. |
| INS-05 | V1 | Separate protocol, application, hostname, and category evidence. A resolved IP or shared CDN address alone must not establish a unique blocked hostname. |
| INS-06 | V1 | Bound parsing, reassembly, flow state, and provisional inspection time/bytes. Resource exhaustion and malformed streams have observable, configured behavior. |
| INS-07 | V1 | Enforce IPv4 and IPv6 consistently on supported paths, including the defined VLAN/NAT topology. Unsupported paths are blocked from enablement or explicitly excluded from scope. |
| INS-08 | V1 | Track late classification. A permitted provisional flow that becomes prohibited is stopped within the published reconsideration bound; earlier forwarded bytes remain disclosed. |
| INS-09 | V1 | Provide optional resolver controls and known encrypted-DNS/tunnel application controls as supporting measures. State their coverage and bypass limits. |
| INS-10 | V1 | Treat TLS, QUIC, ECH, unknown applications, and traffic outside scope as distinct states. Blocking a transport must not be described as guaranteed fallback or successful decryption. |
| INS-11 | T1 | Terminate and re-encrypt selected managed-device TLS connections using a protected, administratively controlled CA. Inspect only the declared protocols and scope. |
| INS-12 | T1 | Support explicit no-decrypt exclusions and configurable behavior for pinning, mutual TLS, handshake errors, and unsupported protocols. Never silently relax a strict inspection requirement. |
| INS-13 | T1 | Apply URL/request controls with canonical matching and documented granularity. Request-level decisions distinguish separate requests on a shared connection. |
| INS-14 | E | Add optional threat, content analysis, and identity providers through capability contracts. Their absence must not alter V1 content semantics. |

TLS 1.3 encrypts handshake material after ServerHello, and ECH hides the inner ClientHello. Passive inspection cannot recover arbitrary HTTPS paths or body content. QUIC Initial processing can expose some handshake metadata, but that does not decrypt application data. These constraints shape the acceptance tests. [TLS 1.3](https://www.rfc-editor.org/rfc/rfc8446.html), [ECH](https://www.rfc-editor.org/rfc/rfc9849.html), [QUIC TLS](https://www.rfc-editor.org/rfc/rfc9001.html)

## 6. Category and application data requirements

| ID | Scope | Requirement and acceptance condition |
|---|---|---|
| DAT-01 | V1 | Ship a legally redistributable baseline dataset with stable category IDs, definitions, source attribution, version, and license metadata. No launch without adequate Adult, Games, and AI coverage in the published validation corpus. |
| DAT-02 | V1 | Maintain separate application-signature and category-data versions. Identify which supplied the evidence for each decision. |
| DAT-03 | V1 | Normalize hostnames, IDNs, domain boundaries, and subdomain behavior consistently. Test sibling domains, public suffixes, deceptive suffix matches, and IPv6 literal destinations. |
| DAT-04 | V1 | Support multiple category labels. A destination matching any blocked category is blocked unless an applicable higher-precedence exception changes the content verdict. |
| DAT-05 | V1 | Validate downloaded/imported datasets before activation. Reject incompatible, corrupt, oversized, unauthenticated Detew release artifacts, and structurally invalid inputs. Quarantine unusual changes for review under a documented rule. |
| DAT-06 | V1 | Activate dataset changes through a new runtime bundle. Retain a known-good version and expose update failure, freshness warning, expiry, and rollback. |
| DAT-07 | V1 | Support local category corrections and private custom lists. Keep local overrides distinct from upstream data and include them in configuration export. |
| DAT-08 | V1 | Work offline using installed data within declared freshness limits. Expired evidence is handled as insufficient classification, not silently treated as current. |
| DAT-09 | V1 | Provide a category tester using the same normalization and lookup logic as enforcement. Include categories, providers, versions, and uncertainty. |
| DAT-10 | E | Permit opt-in remote categorization providers with declared data disclosure, timeout, cache, licensing, and availability behavior. Never require remote per-packet queries. |

Category definitions must state inclusions, exclusions, and boundary examples. “AI services” initially means identified services whose primary offered function is AI-assisted generation or interaction; it does not mean all websites containing an AI feature. “Games” distinguishes gaming service use from games embedded in an otherwise allowed platform. “Adult content” defines sexual-content boundaries without conflating general health or educational material with pornography. The detailed taxonomy and reviewed examples live in the category catalog.

The initial corpus must include Portuguese and English destinations, regional services, IDNs, ordinary benign sites, mixed-purpose platforms, shared-hosting cases, and recently introduced services. Contributors must not need to browse unsafe material or intercept real users to build fixtures.

## 7. Policy and consistency requirements

| ID | Scope | Requirement and acceptance condition |
|---|---|---|
| POL-01 | V1 | Define one typed profile model used by UI, API, import, preview, and engine. All entry points perform equivalent validation; no UI-only policy semantics. |
| POL-02 | V1 | Select exactly one profile per device/flow using explicit assignment precedence, with a site default. Reject ambiguous equal-precedence matches rather than relying on collection order. |
| POL-03 | V1 | Evaluate site guardrails before profile exceptions. Explicit profile exceptions precede profile category/application controls, followed by insufficient-classification behavior and the profile default. Document every tie rule. |
| POL-04 | V1 | Provide recurring schedules with an explicit IANA site timezone, DST behavior, next-transition display, and clock-health behavior. Reconsider active flows at relevant transitions. |
| POL-05 | V1 | Provide scoped, expiring temporary overrides. An override cannot remove site guardrails; expiry survives restart and triggers reconsideration. |
| POL-06 | V1 | Produce reproducible policy decisions for the same bundle, evidence snapshot, assignment context, schedule/override state, and evaluation time. Network timing and changing evidence are explicit inputs. |
| POL-07 | V1 | Separate draft, saved desired configuration, activation progress, and confirmed active state. Show failed or incomplete activation without a success indicator. |
| POL-08 | V1 | Validate and prepare an immutable bundle before coordinated activation. Failed preparation leaves the active bundle unchanged. Mixed worker generations are reported during transition and never reported as fully applied. |
| POL-09 | V1 | Reconsider affected active flows after configuration, dataset, assignment, schedule, or override changes. Define the maximum activation/reconsideration window and disclose flows that cannot be resumed without reconnecting. |
| POL-10 | V1 | Serialize competing activations and reject stale edits using expected revision values. Administrators receive a useful conflict/diff rather than silently overwriting another change. |
| POL-11 | V1 | Record the deciding rule, evidence, revisions, and enforcement outcome. An allowed Detew verdict cannot override an OPNsense firewall denial. |
| POL-12 | V1 | Keep the last known-good bundle operational when UI, control service, logging, or data downloads fail, subject to explicit evidence expiry and runtime failure rules. |
| POL-13 | V1 | Provide separate policies for insufficient classification, provisional evidence collection, and engine failure. “Unknown traffic” and “inspection unavailable” must not share an ambiguous toggle. |
| POL-14 | V1 | Make rollback a new, validated activation of an earlier configuration with compatible available dependencies. State whether data versions are also restored; never implicitly mix incompatible artifacts. |

The [product definition](PRODUCT.md) specifies the ordered policy algorithm, active-flow behavior, identity boundaries, and runtime bundle lifecycle. These are core contracts, not optional enterprise enhancements.

## 8. OPNsense integration and operations

| ID | Scope | Requirement and acceptance condition |
|---|---|---|
| OPS-01 | V1 | Install, update, stop, disable, and remove through supported OPNsense package/service mechanisms. Uninstall restores only Detew-owned hooks and settings and preserves unrelated firewall configuration. |
| OPS-02 | V1 | Use native OPNsense authentication, permissions, CSRF/session protections, and model/backend boundaries. No second mandatory account or privileged browser-to-engine channel. |
| OPS-03 | V1 | Publish tested OPNsense/FreeBSD/package versions, architectures, NICs, topology, and conflicting capture consumers. Enablement preflight must catch known unsupported or conflicting combinations. |
| OPS-04 | V1 | Reuse baseline firewall and routing behavior. Register owned integration artifacts, detect drift, and avoid capturing a packet twice or creating reinjection loops. |
| OPS-05 | V1 | Observe mode computes but does not enforce traffic-policy decisions, including transport restrictions. Disclose adapter-related forwarding/failure risks separately. Enforce mode requires verified attachment and capability readiness; unverified coverage must not produce a healthy protection indicator. |
| OPS-06 | V1 | Offer inspection-bypass or restrictive failure behavior only where the adapter has proved it. Report actual behavior for engine death, overload, reboot, interface loss, and capture failure. |
| OPS-07 | V1 | Support bounded local retention, export, deletion, diagnostics, and configuration backup/restore. Diagnostic bundles exclude sensitive data by default and show a preview. |
| OPS-08 | V1 | Validate configuration migrations, daemon/package compatibility, reboot ordering, and rollback before publishing an update. Publish known limitations and upgrade instructions. |
| OPS-09 | V1 | Keep management recovery reachable using documented OPNsense/console access and tightly scoped exemptions. Exemptions are visible, auditable, and cannot become a broad hidden content bypass. |
| OPS-10 | E | Integrate with redundant OPNsense deployments only after independent testing of Detew configuration, data, CA, runtime, and flow-state behavior. Do not claim CARP/pfsync makes Detew inspection state highly available. |

OPNsense uses a FreeBSD-based platform and native frontend/model/backend integration. Services should consume their own generated configuration and use constrained backend actions rather than arbitrary privileged frontend commands. These are deployment constraints for Detew. [OPNsense architecture](https://docs.opnsense.org/development/architecture.html), [plugin example and backend integration](https://docs.opnsense.org/development/examples/helloworld.html)

Packet attachment is a feasibility decision. Current OPNsense IPS documentation describes Netmap and Divert enforcement modes. Detew must compare supported hooks for coverage, ordering, performance, and failure behavior before selecting one. Availability in another engine does not prove suitability for Detew. [OPNsense IPS capture modes](https://docs.opnsense.org/manual/ips.html)

## 9. UI and experience requirements

### 9.1 Experience principle

The interface should make three questions easy to answer: **What is being filtered? Why did this connection get this result? Has my change taken effect?** A clean appearance is insufficient if any of those answers is misleading.

The proposed visual direction is a calm, precise operational interface: strong typography, restrained color, generous but practical spacing, readable tables, and consistent controls. It should feel approachable in occasional household use and dependable during repeated administrative work. This is design guidance for a future prototype, not an approved brand identity or a rendered UI.

### 9.2 Required journeys and states

| ID | Scope | Requirement and acceptance condition |
|---|---|---|
| UX-01 | V1 | Guide setup through readiness check, inspection scope, profile selection, test device, observe verification, and deliberate enforcement. Show scope/visibility before enablement. |
| UX-02 | V1 | Let a novice block Adult content, Games, and AI services without editing manifests, writing rules, or understanding DPI internals. Category search, definitions, and coverage status are available in place. |
| UX-03 | V1 | Present profile assignments and precedence in ordinary language. Show which profile a device currently uses and explain why. |
| UX-04 | V1 | Use a draft/review/apply workflow. Category switches modify a draft; they do not imply immediate network changes. The UI remains legible during validation, activation, failure, and rollback. |
| UX-05 | V1 | Offer a decision drawer linking a connection to its device, profile, reason, available evidence, and revisions. Create a scoped exception directly from that explanation. |
| UX-06 | V1 | Distinguish policy verdict, enforcement outcome, visibility, and inspection availability. Use text as well as color; “no block observed” is not “connection succeeded.” |
| UX-07 | V1 | Provide Profile, Devices, Activity, Overview, and Settings navigation with progressive disclosure. Advanced controls remain accessible without crowding common tasks. |
| UX-08 | V1 | Cover empty, loading, stale, offline, permission-denied, large-list, apply-conflict, and partial-activation states. A polling failure must not leave a stale “active” indicator. |
| UX-09 | V1 | Meet WCAG 2.2 AA for the Detew-owned surface: keyboard operation, visible focus, semantic labeling, contrast, zoom/reflow, and non-color state communication. Test human workflows in addition to automated checks. |
| UX-10 | V1 | Support English and Brazilian Portuguese in primary flows. Externalize strings; localize times/counts while keeping IDs stable. Long translations must not break layouts. |
| UX-11 | V1 | Support desktop administration and narrow-screen triage. Preserve device/profile context, reason, and recovery actions without requiring a desktop-width grid. |
| UX-12 | V1 | Provide tailored HTTPS failure guidance where a block page cannot be delivered safely. Do not create certificate errors merely to display a branded block page. |
| UX-13 | T1 | Provide explicit enrollment, trust status, inspected scope, exclusions, CA lifecycle, and test-connection verification. “TLS enabled” alone cannot indicate device readiness. |

Detailed screen structure, component states, design tokens, responsive behavior, and UX acceptance are defined in [PRODUCT.md](PRODUCT.md). Avoid promotional “security scores,” decorative network animations, excessive KPI cards, and terminology copied from packet-engine internals.

### 9.3 Usability gates

Run task-based studies with at least five participants who have not developed Detew. At least four must independently create and assign a category profile in ten minutes or less after installation readiness, and at least four must find a block reason and add a narrow exception in three minutes or less. Record mistakes and assistance; installation/download time is measured separately.

Participants must correctly understand when a change is still a draft, when enforcement is bypassed, and why metadata visibility does not equal decrypted content. A polished prototype that consistently misleads users fails the gate even if task completion is fast.

## 10. Security, privacy, and open source requirements

| ID | Scope | Requirement and acceptance condition |
|---|---|---|
| SEC-01 | V1 | Separate privileged attachment/recovery operations from ordinary policy, data ingestion, reporting, and UI services. Define and review every elevated operation. |
| SEC-02 | V1 | Treat packets, category files, imported configuration, extensions, and frontend inputs as untrusted. Apply parser bounds, schema validation, privilege separation, dependency review, and targeted fuzzing. |
| SEC-03 | V1 | Authenticate local IPC peers through OS controls and protect administrative APIs using OPNsense permissions. Do not expose an unauthenticated packet/control socket to the LAN. |
| SEC-04 | V1 | Publish a vulnerability-reporting channel, supported-release policy, dependency inventory, and signed release/checksum verification instructions. Define ownership for urgent updates. |
| SEC-05 | T1 | Protect CA private keys, restrict key access, exclude keys from ordinary diagnostics, and document explicit secure backup, rotation, revocation, and device-trust removal. |
| PRI-01 | V1 | Default to local storage and no external telemetry. Store decision metadata needed for diagnosis; do not retain packet payloads or full browsing content by default. |
| PRI-02 | V1 | Provide retention limits, deletion, collection-disabled mode, and resource quotas. State whether hostnames/device identifiers are collected before enabling detailed activity. |
| PRI-03 | V1 | Make external categorization, crash upload, and contribution sharing opt-in with a data preview. Nothing is submitted automatically from local correction workflows. |
| PRI-04 | T1 | Exclude decrypted bodies, credentials, and sensitive query strings from routine logs. Define sensitive-service exclusions and log minimization before shipping the module. |
| OSS-01 | V1 | Publish source for all required V1 components with an OSI-approved license. Do not impose category, profile, device-count, API, or scheduling paywalls. |
| OSS-02 | V1 | Track software licenses separately from classification/data licenses. Document attribution, redistribution, build dependencies, and the source of each installed dataset. |
| OSS-03 | V1 | Make build, fixture, contribution, review, release, and taxonomy-correction workflows public. Feature and API documentation must be usable without a hosted account. |
| OSS-04 | E | Optional commercial support or hosted services must preserve local administration, data export, documented provider interfaces, and the complete required open source capability set. |

No “zero CVEs,” universal memory-safety, tamper-proof audit, or compliance-certification claims are accepted without corresponding evidence and scope. Rust is a preferred implementation direction, not permission to ignore unsafe FFI, native libraries, or privileged OS interfaces.

## 11. Quality targets and workload definition

These are initial engineering targets. At the feasibility gate, select and publish an exact reference appliance, NIC, OPNsense version, adapter, and workload. Targets may be revised before V1 scope is frozen, with the reason and user impact recorded. Do not relax correctness, privacy, or truthful-status requirements to reach a throughput number.

### 11.1 Initial reference workload

Candidate baseline: an x86_64 appliance with four CPU cores, 8 GiB RAM, SSD storage, and two supported 1 GbE interfaces; routed LAN-to-WAN traffic; native IPv4 and IPv6; no TLS termination. This is a benchmark proposal, not a minimum-hardware promise.

Measure a representative mix of long transfers, short HTTP/TLS connections, supported QUIC, DNS, gaming/application fixtures, benign unknown traffic, and adversarial churn. Include 20,000 concurrent flows and 500 new flows per second as initial capacity targets. Publish packet-size distributions, offered load, connection mix, data catalog size, and enabled features. Separate throughput, latency, packet-rate, classification, and activation tests.

| ID | Scope | Target / release evidence |
|---|---|---|
| QLT-01 | V1 | At least 80% of the same appliance's bypass-mode goodput on the published normal workload below saturation, with p95 added RTT at most 5 ms. Report the saturation point and any loss relative to the baseline. |
| QLT-02 | V1 | At least 20,000 active flows and 500 new flows/second within documented CPU/RAM limits. Engine state must remain bounded under excess offered load. |
| QLT-03 | V1 | Local policy/data lookup never waits synchronously for a remote provider. Runtime counters distinguish lookup miss, parser limit, queue pressure, and enforcement failure. |
| QLT-04 | V1 | Normal configuration activation and affected-flow reconsideration complete within 5 seconds at the reference load; the UI reports progress until completion. Publish p50/p95/p99 and failure cases. |
| QLT-05 | V1 | Normal local interactive actions acknowledge within 200 ms; common data views return within 1 second at the reference dataset/list size. Rendering remains responsive during background updates. |
| QLT-06 | V1 | Pass a 72-hour reference-workload soak without unexplained engine termination, unbounded memory/disk growth, or loss of verified inspection attachment. Publish observed errors and recovery behavior. |
| QLT-07 | V1 | On the independently reviewed corpus, category precision at least 98% and recall at least 90% for each required category among eligible, visible, labeled destinations. Report sample size, uncertainty, exclusions, and uncategorized share separately. |
| QLT-08 | V1 | Supported application tests include positive cases, lookalike negatives, encrypted variants, and classification-late cases. Publish per-application results rather than a single library-wide accuracy claim. |
| QLT-09 | V1 | Every block in the acceptance corpus has a traceable reason and confirmed or failed enforcement outcome. Missing evidence produces an explicit record state rather than fabricated detail. |
| QLT-10 | T1 | Publish an independent TLS workload/capacity profile, added latency, protocol coverage, and trust/failure test results. V1 metadata benchmarks do not apply to TLS termination. |

An eligible destination has a reviewed category label and enough observable evidence for the tested mode. Coverage across **all attempted traffic**, including ECH, tunnels, unseen domains, and paths outside scope, is reported separately. These denominators prevent high precision on a narrow sample from being marketed as universal protection.

## 12. Release plan and gates

Release gates depend on evidence, not speculative calendar dates. Design and dataset work can proceed alongside engine development, but production scope cannot outrun validated packet integration.

The [development milestones](MILESTONES.md#2-milestone-sequence-and-dependencies) turn these gates into sequenced work packages and task dependencies. M02–M04 supply G0 evidence, M05 closes G1, M06–M10 complete and validate G2, and M11 closes G3. M12 and selected M13 child milestones cover G4/G5 separately. Requirement meanings and acceptance targets remain authoritative here; milestone completion cannot waive them.

| Gate | Deliverable | Exit evidence |
|---|---|---|
| G0 — Feasibility | Minimal inline prototype; category-data audit; interaction prototype | Validated packet hook with pf ordering/reinjection/failure behavior; FreeBSD classifier build; candidate data licensing and three-category corpus; setup/block/explain prototype study |
| G1 — Developer alpha | Local classification/enforcement pipeline and native plugin shell | Repeatable end-to-end IPv4/IPv6 tests, category and application decisions, bundle activation, decision records, bounded parser/resource behavior |
| G2 — Pilot beta | Complete V1 policy and UI workflows | S-01 through S-08, independent pilot installs, upgrades/recovery, privacy defaults, reference benchmarks, category/application quality results |
| G3 — V1 general availability | Supported open source release | All V1 requirements evidenced; unresolved security/correctness blockers closed; supported matrix, public docs, maintenance ownership, signed distributable artifacts |
| G4 — T1 managed TLS | Optional full TLS/request inspection module | INS-11–13, UX-13, SEC-05, PRI-04, QLT-10, trust/enrollment/recovery/pinning tests, independent module review |
| G5 — Ecosystem expansion | Selected extension modules | Demonstrated demand, versioned compatibility contracts, isolated permissions/resources, complete docs and tests for each claimed capability |

G0 must compare relevant FreeBSD packet-hook options instead of assuming a Linux data path. If an adapter cannot implement a claimed failure behavior, that behavior is unavailable in the UI. If no suitable category sources can be redistributed and maintained, category-data work becomes a release blocker.

### 12.1 V1 definition of done

Use the [milestone requirement ownership table](MILESTONES.md#6-requirement-ownership) to assign task coverage and the [evidence contract](MILESTONES.md#52-evidence-artifacts-and-measurement-rules) to record implementation and release results. Every current requirement has a primary delivery milestone; that mapping is a planning responsibility, not evidence that a requirement is satisfied.

- Every V1 requirement has an implementation owner and acceptance evidence linked from the release report.
- The required category/application capabilities are functional on supported hardware, independently of the resolver used by clients where observable flow evidence exists.
- Core policy contracts match the UI, API, test harness, and runtime behavior.
- Pilots complete essential tasks and understand enforcement/visibility status.
- IPv6, active sessions, malformed input, resource exhaustion, process death, reboot, restore, and update rollback are covered.
- Every known limitation is documented in product language, including encrypted traffic, partial observation, category coverage, and existing security-product conflicts.
- Release packages, code licenses, data licenses, documentation, and maintenance processes are available publicly.
- No unresolved defect can silently disable enforcement, misreport active state, bypass a guardrail, expose secrets, or corrupt the accepted configuration without recovery.

## 13. Verification matrix

| Suite | Required examples | Related requirements |
|---|---|---|
| Policy semantics | Overlapping assignments; exception priority; multiple category labels; site guardrails; unknown traffic; replayed evidence | POL-01–06, POL-11, DAT-03–04 |
| Lifecycle | Concurrent edits; bad bundle; worker failure; data rollback; restart during apply; expired override; schedule transition | POL-07–14, DAT-05–08, OPS-08 |
| Packet integration | IPv4/IPv6; TCP/UDP/QUIC; VLAN; NAT identity; pf denial; reinjection; offload settings; competing consumers | INS-01–08, OPS-03–06 |
| Visibility and evasion | ECH; DoH/DoT; direct IP; absent SNI; shared CDN; fragmented ClientHello; TCP segmentation; tunnels | INS-02–10, INS-05–06, POL-13 |
| Failure injection | UI/controller death; engine death; disk full; logging backlog; provider outage; interface reset; clock loss | POL-12–13, OPS-06–09, SEC-01–03 |
| Data quality | Three required categories; benign boundary cases; Portuguese/English; source corruption; taxonomy changes | DAT-01–10, QLT-07–08 |
| UI workflows | Setup; profile edit; exception; apply conflict; stale status; viewer role; narrow screen; Portuguese; keyboard/screen reader | UX-01–12 |
| Security/privacy | API permissions/CSRF; parser fuzzing; secret handling; diagnostic export; retention deletion; malicious import | SEC-01–04, PRI-01–03, OSS-02 |
| Capacity/reliability | Published normal/adversarial workload, flow churn, update under load, 72-hour soak | QLT-01–06, QLT-09 |
| Optional TLS | Trust installation/removal; key rotation; mTLS; pinning; QUIC policy; URL canonicalization; multiplexed requests | INS-11–13, UX-13, SEC-05, PRI-04, QLT-10 |

The policy tester must share canonical matching and evaluation code with the runtime. A simulated allow proves a policy result for the supplied context; it does not prove that a real network connection will succeed.

## 14. Open source sustainability and governance

Proposed licensing baseline: GPL-3.0-or-later for Detew-owned software, with independently licensed dependencies and separately documented datasets. This is a proposal to confirm before accepting code contributions or distributing binaries, not an enacted license for the existing repository. Audit dependency/linking and dataset terms against the selected release model; a software license does not authorize redistribution of all upstream lists. [GPL v3 at the Open Source Initiative](https://opensource.org/license/gpl-3.0)

Adopt public issue templates for bugs, classification corrections, feature requests, and security reports. Keep taxonomy changes reviewable with examples, provenance, and rationale. Publish a maintainer list, review expectations, supported release branches, deprecation notices, and a decision process for contested categories.

Do not automatically crowdsource browsing records. A user can prepare a correction with an explicit destination and review its contents before submitting it. Upstream contributions require human authorization and source licensing review.

Potential funding mechanisms are donations, sponsorship, paid support, appliance partnerships, and optional managed services. None should make core category filtering unusable without payment or a hosted service. Organizational adoption depends on maintainability and evidence, not the presence of a premium edition.

## 15. Principal risks and decision register

| Risk / decision | Required response | Deadline |
|---|---|---|
| Category data incomplete or cannot be redistributed | License/provenance audit; quality corpus; local curation; explicit gap reporting | G0/G2 |
| FreeBSD capture path unreliable or conflicts with existing IPS | Compare adapters; validate ownership/order; publish exclusions; preflight conflicts | G0 |
| DPI classifier adds unsafe/native dependencies | Bounded interface, pinned versions, license review, fuzzing, crash containment strategy | G0/G1 |
| Encrypted metadata becomes less visible | Explicit insufficient-classification controls; supported QUIC; ECH states; optional managed TLS | G1/G4 |
| Simplicity conceals consequential settings | Plain-language previews, visible defaults, no hidden bypass; task studies | G0/G2 |
| Profile attribution follows a reused IP incorrectly | Evidence lifetimes and conflict handling; IPv6/privacy-address tests; default-profile fallback | G1 |
| Updates change filtering unexpectedly | Versioned datasets, reviewed diffs, signed Detew artifacts, reconsideration, rollback | G1/G2 |
| Process failure creates unnoticed bypass or outage | Adapter-proven failure modes, watchdog/recovery, observable actual status | G0/G2 |
| Optional TLS expands trust and privacy risk | Separate gate, scoped enrollment, secure key lifecycle, minimized logging | G4 |
| Scope expands into a replacement firewall | Keep host responsibilities explicit; require a new decision for additional distributions | Continuous |
| Project cannot sustain updates | Named maintainers, source-independent formats, repeatable releases, published support scope | G3 |

Decisions to close before G0 exit: packet adapter; initial supported topology/hardware; first classifier; approved category sources and taxonomy; preferred software license; provisional inspection/failure-mode feasibility. Decisions to close before G2: measured resource defaults and limits; exact classifier catalog; category-update quarantine thresholds; final UI component implementation and visual prototype; package upgrade/support policy.

## 16. Definition of success

Detew succeeds when a user can configure the categories and applications they care about, understand actual filtering decisions, recover from mistakes, and keep using the product without a required subscription. For the project, success also requires a maintainable engine, defensible category data, public release evidence, and contributions that fit stable contracts.

The near-term claim is deliberately measurable: a polished, reliable, freely configurable OPNsense filtering plugin. Broader deployment and ecosystem growth are earned by that foundation.
