# Development task backlog

The backlog translates [MILESTONES](../MILESTONES.md) into individually reviewable tasks and one issue per task in [JoseLArantes/detew](https://github.com/JoseLArantes/detew/issues). Each task includes foundation references, deliverables, independent acceptance criteria, required tests/experiments, failure/privacy boundaries, evidence, and direct prerequisites. Planning and issue creation do not complete any implementation or release gate.

## Find the next task

- [Task index](INDEX.md): stable topological order, scope, initial readiness, and issue links.
- [Dependency graph and prerequisite table](DEPENDENCIES.md): explicit task-level edges; milestone pages show the local branches.
- [Requirement coverage](COVERAGE.md): all PRD requirements mapped to planned tasks.
- [Publication and verification record](PUBLICATION.md): issue/dependency counts, creation snapshot, and first eligible tasks.
- [Development orchestration](../DEVELOPMENT.md): how to select, assign, execute, review, integrate, and hand off the work.
- [GitHub milestones](https://github.com/JoseLArantes/detew/milestones): delivery groups matching M00–M13.
- [Ready issues](https://github.com/JoseLArantes/detew/issues?q=is%3Aissue%20is%3Aopen%20label%3Astatus%3Aready): work with no unresolved hard prerequisite at the creation snapshot; confirm current entry conditions before starting.

Select an eligible V1 task from the earliest unfinished milestone, then priority and available ownership. Independent research, lab planning, corpus curation, and interview recruitment can proceed alongside the implementation path where their dependency edges permit it. Start with the software-license decision and reproducible lab/build foundations; do not enact the proposed license merely by accepting this backlog.

## Hierarchy and rolling refinement

Release gates define accepted outcomes. Milestones group delivery. Work packages identify a cohesive result within a milestone. Task IDs `Mxx-Wyy-Tzz` identify the reviewable units beneath them. The issue title starts with the same ID and carries the same detailed specification.

M00–M11 comprise V1. M12 is optional managed TLS after V1. M13 is selected ecosystem work; its candidate provider/platform/fleet branches are conditional, not a requirement to implement every possibility. Later tasks are detailed planning specifications with explicit refinement notes. Freeze exact capabilities, interfaces, estimates, and protocols from predecessor evidence before scheduling them.

Task dependencies are accepted-output prerequisites. The graph is a DAG with independent branches, not a required single-file sequence. Gate decision tasks aggregate complete evidence; completing implementation subtasks alone cannot admit an adapter, approve a category source, or accept a release. A failed spike may finish its investigation while the dependent gate stays blocked.

## Labels and workflow

| Axis | Labels | Meaning |
|---|---|---|
| Scope | `scope:v1`, `scope:t1`, `scope:e` | First release, optional managed TLS, selected ecosystem extensions |
| Priority | `priority:p0`, `priority:p1`, `priority:p2` | Critical foundation/correctness/gate dependency; required scoped delivery; deferred optional work |
| Work type | `type:decision`, `type:spike`, `type:feature`, `type:test`, `type:docs`, `type:release` | The principal outcome of the task |
| Owning area | `area:core`, `area:packet`, `area:classifier`, `area:data`, `area:control`, `area:activity`, `area:opnsense`, `area:ui`, `area:security`, `area:build`, `area:quality`, `area:governance`, `area:research`, `area:release`, `area:tls`, `area:extensions` | One primary area; cross-component obligations stay in the specification |
| Workflow | `status:ready`, `status:blocked`, `status:in-progress`, `status:in-review`, `status:deferred` | Eligible after refinement; waiting for prerequisite/blocker; underway; awaiting evidence acceptance; outside active scope |
| Relative size | `size:s`, `size:m`, `size:l` | Qualitative refinement input, not hours or delivery dates |

Use exactly one label per axis on open tasks. After accepted completion, close the issue and remove its open-workflow label while retaining the five classification labels. Existing repository labels are retained. Native GitHub issue relationships represent hard blocking dependencies and provide their reverse blocking view. Dependency URLs are also in each issue body and local task document. [GitHub documents these relationships](https://docs.github.com/en/issues/tracking-your-work-with-issues/using-issues/creating-issue-dependencies).

At creation, V1 tasks with unmet prerequisites have `status:blocked`; independent roots have `status:ready`. T1/E tasks have `status:deferred`. These are a dated planning snapshot. There is no background status automation: after accepting a predecessor, check its dependent tasks, required gate decisions, missing inputs, and reviewers before manually moving an eligible issue to ready. A deferred task remains deferred until its scope is explicitly selected.

Assign an actual owner and reviewer during scheduling. Keep one active implementation task per owner where practical, finish evidence/review before pulling another, and coordinate use of the native lab. Split an oversized task before starting rather than treating `size:l` as a long-running unreviewable change. Do not invent dates, staffing, velocity, or due dates from the plan.

## Ready and done

A task is ready for execution when its hard prerequisites and gates are accepted, scope/inputs are available, its contract and independent acceptance procedure are clear, and an owner/reviewer is assigned. The ready label by itself does not prove those conditions remain true.

A task is done when its stated deliverables and acceptance criteria have evidence at an exact revision, relevant tests ran on the required environment, foundation/schema/docs changes are synchronized, and a reviewer accepts the result. Close the issue with an evidence summary and links. Rejected candidates, missing checks, unsupported environments, and remaining release limitations stay explicit. Gate issues close only after the responsible maintainer records the corresponding gate decision.

Use synthetic or safely curated licensed fixtures. Native kernel/FFI/packet changes require FreeBSD/OPNsense evidence; portable or mocked checks are supplemental. UI acceptance includes interaction, consequential states, localization, visual consistency, and manual accessibility where appropriate. Category/application quality retains independent corpora and PRD denominators. Every failure test states what should remain active and what the user should observe.

## Sources, rendering, and publication

The source catalogs [M00–M04](catalog-m00-m04.json), [M05–M08](catalog-m05-m08.json), and [M09–M13](catalog-m09-m13.json) hold the versioned task definitions. [catalog.json](catalog.json), individual task Markdown, milestone indexes, dependency/coverage tables, and [github.json](github.json) provide generated views and the publication crosswalk. Edit the source task definition and render the views together; do not let the issue and local specification develop different acceptance criteria.

The management helper runs from the repository root:

```sh
python3 docs/tasks/manage.py validate
python3 docs/tasks/manage.py render
python3 docs/tasks/manage.py publish
python3 docs/tasks/manage.py verify
```

Validation checks field/ID/scope/package/requirement/anchor integrity, complete work-package/requirement coverage, and acyclic dependencies. Rendering creates local readable views. Publication uses the authenticated `gh` CLI, verifies the fixed target repository, creates missing labels/milestones/issues in prerequisite order, and adds native blocking relationships. It checkpoints issue identities, detects duplicates by task ID, and reuses existing task issues when resumed. Verification reads actual remote bodies, labels, milestones, and native relationships; a local checkpoint alone is insufficient proof of publication.

Publication is an explicit write operation authorized for this backlog. This helper does not commit/push repository files, assign people, close implementation issues, or create a project board. Issue bodies contain the complete task definition and link to foundation documents at the recorded repository revision. The local task path is identified without inventing a remote link to an unpushed task file. Subsequent contract changes require deliberate reconciliation of the existing issue body and relationships rather than creating another issue with the same task ID.

GitHub issues hold live execution progress; the index/cards/crosswalk preserve the creation snapshot. The `verify` command compares remote metadata with that snapshot, so intentional workflow changes need separate review rather than resetting live labels. Follow [DEVELOPMENT](../DEVELOPMENT.md#9-changes-and-backlog-synchronization) for definition reconciliation and ongoing coordination.

Keep [AGENTS](../../AGENTS.md), the [milestone synchronization rules](../MILESTONES.md#81-ownership-and-update-triggers), the task catalogs/views, and GitHub metadata aligned. The backlog management helper is documentation/project tooling; it does not implement product build/test entry points planned for M00.
