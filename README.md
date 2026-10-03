# Detew

Detew is an open source web and application filtering platform, delivered first as an OPNsense plugin. It aims to make category and application controls easy to configure, understand, and maintain across household, small-business, and organizational networks.

**Project stage:** product, architecture, and development planning. The documents are a baseline dated **October 2, 2026**. No engine, plugin, dataset, UI, supported hardware matrix, or release gate has been implemented or validated in this repository. There is no installation package yet.

## Development foundation

| Document | Owns |
|---|---|
| [PRD](docs/PRD.md) | Outcomes, scope, stable requirements, acceptance targets, and release gates |
| [Product definition](docs/PRODUCT.md) | Domain objects, policy behavior, lifecycle, operations, and UI/UX contracts |
| [Architecture and stack](docs/ARCHITECTURE.md) | Selected technologies, dependency/privilege boundaries, runtime mechanisms, and integration evidence gates |
| [Domain language](docs/CONTEXT.md) | Canonical vocabulary for code, APIs, requirements, and explanations |
| [Development milestones](docs/MILESTONES.md) | Milestone sequence, dependencies, work packages, requirement ownership, task template, and completion evidence |
| [Detailed task backlog](docs/tasks/README.md) | Reviewable task specifications, testing/acceptance, dependency graph, labels, and GitHub issue crosswalk |
| [Development orchestration](docs/DEVELOPMENT.md) | Execution loop, work selection, ownership, parallel coordination, review, gate advancement, and resumable handoffs |
| [Development guide](AGENTS.md) | Instructions for contributors and coding agents working from this foundation |

Read the PRD, then PRODUCT, ARCHITECTURE, and MILESTONES; use the task backlog to select and refine implementation work, CONTEXT for terminology, and AGENTS for contributor instructions. Follow DEVELOPMENT to coordinate each execution run. Resolve discrepancies in the affected documents before implementing contradictory behavior. The milestone plan and task backlog convert requirements and contracts into delivery work; they do not replace them.

## Scope and stack

OPNsense provides the underlying firewall, routing, NAT, administration, and package lifecycle. Detew adds flow-aware inspection, locally enforceable category/application policies, and understandable decision explanations. Adult content, Games, and AI services are required initial categories; the same core and open feature set serve different site types.

The selected baseline uses Rust 2024 shared libraries and inspection/control/activity services, native OPNsense models and administration, React/TypeScript/Vite with scoped Tailwind/Radix components, local FST category indexes, and SQLite activity storage. nDPI is the preferred classifier and Netmap the preferred packet-adapter candidate, with Divert compared during feasibility. Support claims depend on the architecture gates, not those selections alone.

Full TLS/request inspection is a separate optional managed-device module after V1. Metadata filtering reports its actual visibility limits. DNS is a supporting control within the flow-aware design.

## Delivery path

The [milestone plan](docs/MILESTONES.md#2-milestone-sequence-and-dependencies) defines M00–M11 from bootstrap and canonical policy through feasibility, developer alpha, complete workflows, hardening, independent pilots, and V1. M12 covers optional TLS; M13 scopes selected ecosystem extensions.

All milestones are currently **planned**. Packet/classifier/data/host feasibility must close G0 before alpha acceptance. Independent pilot and usability evidence close G2; complete requirement evidence, distributable artifacts, and maintenance ownership close G3. Dates, budgets, and quality figures in the documents are planning targets until measured.

Start development with [M00 bootstrap](docs/MILESTONES.md#m00-project-bootstrap-and-governance) and [M01 canonical contracts](docs/MILESTONES.md#m01-shared-contracts-and-canonical-policy-reference), selecting tasks whose entry conditions are met. Use the [task template](docs/MILESTONES.md#72-task-template) when refining or adding work. Build/check entry points and exact toolchain versions are established during M00. The software-license baseline remains a proposal until the governance decision is recorded; source/data licenses are reviewed separately.

Use the [development playbook](docs/DEVELOPMENT.md#1-start-a-development-run) to inspect current work, assign a bounded task, coordinate parallel contributors, and carry the result through validation, review, integration, and milestone decisions. It includes the initial eligible queue and checkpoint templates.

The [task index](docs/tasks/INDEX.md), [dependency graph](docs/tasks/DEPENDENCIES.md), and [requirement coverage](docs/tasks/COVERAGE.md) make the backlog navigable. Each task has a corresponding issue in [JoseLArantes/detew](https://github.com/JoseLArantes/detew/issues), organized by milestone and scope/type/area/priority/status/size labels. Implementation remains unstarted; readiness requires accepted prerequisite outputs and current gate evidence.

## Research references

The [technology study](docs/open_research_01.md) and [reference collection](docs/open_research_02.md) provide technical background. Product requirements and development decisions are defined by the foundation documents above and supported by their primary-source references.
