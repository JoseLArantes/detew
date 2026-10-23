# Contributing to Detew

Detew is owned and maintained in [JoseLArantes/detew](https://github.com/JoseLArantes/detew). Original project material is licensed under [MIT](LICENSE). Contributors retain their copyright; contribution review does not transfer ownership to the repository owner.

The repository is establishing its foundation. A portable Rust workspace and static UI development preview build locally; no product runtime, firewall integration, installation package, or isolated native lab has been validated. Follow the pinned commands below and record native checks as unavailable until their prerequisites and harness exist. Clean-checkout and independent acceptance checks are tracked by [M00-W01-T02](docs/tasks/m00/M00-W01-T02.md).

## Start here

1. Find an existing issue or [open a small issue](https://github.com/JoseLArantes/detew/issues/new/choose) describing one problem, proposal, or documentation gap.
2. For planned work, choose a task from the [backlog](docs/tasks/README.md) and confirm its prerequisites and scope.
3. Comment on the issue before substantial work when the solution, ownership, or compatibility impact is unclear.
4. Create a focused branch, make a small change, run the relevant tests, and open a pull request using the repository template.

Keep one coherent change per issue/PR. A contributor does not need to understand the entire architecture to improve one documented bug, test, or bounded task. Reviewers may ask for a follow-up issue when a proposal grows beyond the original outcome.

## Issues

Use the [bug report](https://github.com/JoseLArantes/detew/issues/new?template=bug_report.md), [feature request](https://github.com/JoseLArantes/detew/issues/new?template=feature_request.md), [documentation issue](https://github.com/JoseLArantes/detew/issues/new?template=documentation.md), or [category correction](https://github.com/JoseLArantes/detew/issues/new?template=taxonomy_correction.md) template. Blank issues remain available when none fit. Search existing issues first, use a clear Conventional Commit-style prefix when it fits (`fix:`, `feat:`, `docs:`, `data:`), and include only the smallest useful context.

Bug reports should include the observed behavior, expected behavior, exact version/revision, environment/topology, reliable reproduction steps, relevant logs with secrets and private activity removed, and whether the issue is a regression. Feature requests should explain the user problem, proposed outcome, alternatives, boundaries, and how success could be tested. Documentation reports should identify the page/section, confusing or incorrect text, and a proposed correction when possible.

Do not put vulnerability details, credentials, appliance backups, private browsing history, or sensitive network captures in public issues. Use the repository's [private vulnerability reporting route](SECURITY.md) for security issues.

Blank issues remain enabled for cases that do not fit a template. Give them a descriptive title and explain why the existing templates do not fit.

## Contribution rights and provenance

By submitting original work, you confirm that you have the right to submit it under the project's MIT terms. You keep the copyright to your contribution; submission does not transfer ownership to the project. No CLA or commit sign-off is required.

Identify any incorporated third-party material, its source, and its applicable terms. Preserve required upstream license texts and notices. Employer-owned or otherwise controlled work needs the appropriate permission. Do not submit material when its rights are unclear. Data must permit the project's intended copying and redistribution; download access alone is not permission, and data without redistribution rights cannot be accepted or bundled. Review provenance for AI-assisted contributions too; assistance does not establish rights to copied code or datasets.

## Conventional commits

Use the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) format for every commit:

```text
<type>[optional scope]: <short imperative description>

[optional body]

[optional footer(s)]
```

Use a lowercase type such as `feat`, `fix`, `docs`, `test`, `refactor`, `perf`, `build`, `ci`, `chore`, or `revert`. Keep the subject concise and imperative, explain the user or engineering reason in the body when it is not obvious, and use `!` or a `BREAKING CHANGE:` footer for a public contract break. Reference the issue in the pull request; use a commit footer only when the relationship is clear.

Examples:

```text
feat(policy): explain category match reasons
fix(activity): preserve stale timestamp after refresh failure
docs: clarify contributor test workflow
test(core): cover schedule boundary at daylight-saving transition
```

Do not rewrite another contributor's authorship. Maintainers may ask for a clean, logically grouped history or squash a PR during merge while preserving accurate attribution.

## Task completion and commits

A task-owned change is not complete while its work remains only in the working tree. Before requesting final review or closing the task, commit the implementation, tests, documentation, generated contracts, and evidence that belong to the task. Every task-owned commit must use the Conventional Commits format. Record the accepted commit hash in the pull request and task completion record; that exact revision is the basis for review and evidence. Unrelated work in the shared working tree may remain outside the task commit.

## Choose and prepare work

1. Read [AGENTS](AGENTS.md), the [development playbook](docs/DEVELOPMENT.md), and the selected [task](docs/tasks/INDEX.md).
2. Confirm selected scope, accepted prerequisites/gates, task ownership and reviewer, and the relevant PRD/PRODUCT/ARCHITECTURE contracts.
3. Use a bounded issue/branch and coordinate overlapping files, generated contracts, and native lab access. Preserve existing work.
4. For a new dependency/source, complete the [admission policy](docs/governance/LICENSE_POLICY.md#4-admission-checklist-and-decision) and [register fields](docs/governance/DEPENDENCIES.md#2-record-fields) before inclusion. Registry metadata or free download access does not establish permission.

Use a branch named `feat/<short-topic>`, `fix/<short-topic>`, `docs/<short-topic>`, `test/<short-topic>`, or `chore/<short-topic>`. Keep branch names short and use lowercase kebab-case. Do not commit directly to the default branch.

## Checks and review

Quality gates come from unit, integration, and smoke tests. The portable bootstrap gate is available; native integration remains an explicit unavailable result until the isolated FreeBSD/OPNsense test harness is implemented. Planning/backlog helpers are not contributor quality gates.

```sh
# Run the exact pinned portable checks from the repository root.
./scripts/check-portable.sh

# Native checks report unavailable with exit code 3 until an implementation and lab exist.
./scripts/check-native.sh

# Run both and preserve portable/native status separately.
./scripts/check-all.sh
```

Run the smallest relevant set locally, then the complete portable gate before requesting review. A contribution touching the packet path, native FFI, lifecycle, storage, packaging, or host integration must include corresponding integration/smoke evidence; the unavailable bootstrap result cannot satisfy it. A UI change must exercise user-visible success, empty/loading, stale/error, permission, and conflict states where applicable.

If a command is not available yet, do not invent a passing result. State it in the PR under “Tests” and link the task or blocker that will establish it. Keep test fixtures synthetic or safely curated and licensed. Remove secrets, credentials, appliance backups, and private activity from logs and screenshots.

A review submission identifies the task/PRD/ARC IDs, observable change, owned contracts, expected and actual validation, evidence, limitations, and any licensing/inventory/document changes. The reviewer records acceptance or changes. [MILESTONES' definition of done](docs/MILESTONES.md#73-definition-of-done-for-tasks) and the [execution playbook](docs/DEVELOPMENT.md#7-validation-and-review) govern completion. Failed feasibility results can be valid findings while their integration gate remains blocked.

## Pull requests

Open a PR as soon as the direction benefits from review, even if the work is marked draft. Keep the title in Conventional Commit style, for example `feat(ui): add category profile editor`. Link the issue with `Fixes #123` when the PR completes it, or `Refs #123` when it contributes without closing it. Explain the user-visible result and the reason for the change in the PR body; reviewers should not need to reconstruct the intent from the diff.

Before requesting review, confirm that the PR is focused, the implementation and tests are included, generated outputs are synchronized, dependency/source admission is documented, and no unrelated formatting or refactor is mixed in. Describe unavailable checks and known limitations plainly. Respond to review comments with a new commit or a clear explanation; do not resolve a comment without addressing it.

Maintainers review correctness, compatibility, security/privacy, tests, user experience, documentation, and license/provenance. Approval does not waive a required native, integration, smoke, independent-pilot, or release-gate check. CI must pass before merge, and a maintainer may request a second reviewer for security, policy, native, or release-sensitive changes.

## What gets merged

Changes merge when the PR has a clear issue/task relationship, appropriate review, passing applicable unit/integration/smoke tests, and synchronized documentation/contracts. Keep planned, implemented, tested, and supported claims separate. A green unit suite does not claim packet-path support or a release gate unless the required integration and smoke evidence also exists.

## Data, corrections, and privacy

Use synthetic or safely curated licensed fixtures. Keep real browsing records, appliance backups, credentials, and keys out of public issues, tests, commits, and screenshots. Review source/data redistribution rights separately from code licenses.

Prepare a taxonomy/classification correction with provenance, expected labels, rationale, and an explicit content/redaction preview. It remains local until the contributor chooses and authorizes submission. No automatic upload or browsing-history collection belongs in this workflow.

## Notices and security

Preserve upstream copyright/license material and update [third-party notices](THIRD_PARTY_NOTICES.md) and the dependency/data records. Detew's MIT grant does not replace other components' terms.

The active private vulnerability-reporting route and maintainer responsibilities are documented in [SECURITY.md](SECURITY.md). The project has no supported release yet. Do not put sensitive vulnerability or appliance details into a public issue.
