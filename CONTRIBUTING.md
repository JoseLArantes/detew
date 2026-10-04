# Contributing to Detew

Detew is owned and maintained in [JoseLArantes/detew](https://github.com/JoseLArantes/detew). Original project material is licensed under [MIT](LICENSE). Contributors retain their copyright; contribution review does not transfer ownership to the repository owner.

The repository is currently establishing its foundation. The product build, installation package, native lab, and runtime test entry points are not validated yet. M00 establishes the exact toolchain and commands; this guide defines the contributor workflow that will use them. The licensing/contribution documents provide the initial rights and review policy; their remaining clean-checkout and independent acceptance checks belong to [M00-W01-T02](docs/tasks/m00/M00-W01-T02.md).

## Start here

1. Find an existing issue or [open a small issue](https://github.com/JoseLArantes/detew/issues/new/choose) describing one problem, proposal, or documentation gap.
2. For planned work, choose a task from the [backlog](docs/tasks/README.md) and confirm its prerequisites and scope.
3. Comment on the issue before substantial work when the solution, ownership, or compatibility impact is unclear.
4. Create a focused branch, make a small change, run the relevant tests, and open a pull request using the repository template.

Keep one coherent change per issue/PR. A contributor does not need to understand the entire architecture to improve one documented bug, test, or bounded task. Reviewers may ask for a follow-up issue when a proposal grows beyond the original outcome.

## Issues

Use the [bug report](https://github.com/JoseLArantes/detew/issues/new?template=bug_report.md), [feature request](https://github.com/JoseLArantes/detew/issues/new?template=feature_request.md), or [documentation issue](https://github.com/JoseLArantes/detew/issues/new?template=documentation.md) template. Search existing issues first, use a clear title, and include the smallest reproducible context.

Bug reports should include the observed behavior, expected behavior, exact version/revision, environment/topology, reliable reproduction steps, relevant logs with secrets and private activity removed, and whether the issue is a regression. Feature requests should explain the user problem, proposed outcome, alternatives, boundaries, and how success could be tested. Documentation reports should identify the page/section, confusing or incorrect text, and a proposed correction when possible.

Do not put vulnerability details, credentials, appliance backups, private browsing history, or sensitive network captures in public issues. Until [M00-W01-T03](docs/tasks/m00/M00-W01-T03.md) establishes the private reporting route, do not claim that a public issue is a secure disclosure channel; ask a maintainer for the current private route through an existing trusted channel.

Blank issues remain enabled for cases that do not fit a template. Give them a descriptive title and explain why the existing templates do not fit.

## Rights and sign-off

Submit original work under MIT, and certify that you have the right to contribute it. For incorporated material, preserve its upstream terms/notices and identify its source, exact revision, modifications, and permission to include it. Employer-owned or otherwise controlled work needs the appropriate permission. Unclear rights block acceptance.

Use a sign-off certifying the [Developer Certificate of Origin 1.1](https://developercertificate.org/):

```sh
git commit -s
```

Use an identity you are entitled to certify. A sign-off is a contribution-rights statement, not a copyright assignment or cryptographic signature. The certificate explains that the public contribution/sign-off record may be retained and redistributed. This baseline requires no separate CLA. Review provenance even for AI-assisted contributions; assistance does not establish rights to copied code or datasets.

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

Add the DCO sign-off to each commit:

```sh
git commit -s -m "docs: clarify contributor test workflow"
```

Do not squash away sign-offs or rewrite another contributor's authorship. Maintainers may ask for a clean, logically grouped history or squash a PR during merge while preserving the required attribution and sign-offs.

## Task completion and commits

A task-owned change is not complete while its work remains only in the working tree. Before requesting final review or closing the task, commit the implementation, tests, documentation, generated contracts, and evidence that belong to the task. Every task-owned commit must use the Conventional Commits format and include the DCO sign-off. Record the accepted commit hash in the pull request and task completion record; that exact revision is the basis for review and evidence. Unrelated work in the shared working tree may remain outside the task commit.

## Choose and prepare work

1. Read [AGENTS](AGENTS.md), the [development playbook](docs/DEVELOPMENT.md), and the selected [task](docs/tasks/INDEX.md).
2. Confirm selected scope, accepted prerequisites/gates, task ownership and reviewer, and the relevant PRD/PRODUCT/ARCHITECTURE contracts.
3. Use a bounded issue/branch and coordinate overlapping files, generated contracts, and native lab access. Preserve existing work.
4. For a new dependency/source, complete the [admission policy](docs/governance/LICENSE_POLICY.md#4-admission-checklist-and-decision) and [register fields](docs/governance/DEPENDENCIES.md#2-record-fields) before inclusion. Registry metadata or free download access does not establish permission.

Use a branch named `feat/<short-topic>`, `fix/<short-topic>`, `docs/<short-topic>`, `test/<short-topic>`, or `chore/<short-topic>`. Keep branch names short and use lowercase kebab-case. Do not commit directly to the default branch.

## Checks and review

Quality gates come from the implementation's unit, integration, and smoke tests. Planning and backlog helpers are not contributor prerequisites. M00 will pin the exact entry points; until then, the following shows the required gate shape and must not be reported as currently available commands:

```sh
# Rust/core and service changes
cargo fmt --check
cargo clippy --workspace --all-targets --all-features -- -D warnings
cargo test --workspace

# UI/host changes, when the affected package exists
npm ci
npm run lint
npm test -- --run
npm run build

# Integration and packaged smoke checks, when the affected target exists
npm run test:integration
npm run test:smoke
```

Use the repository's documented equivalent when M00 pins different commands or a task needs a native FreeBSD/OPNsense harness. Run the smallest relevant set locally, then the complete required set before requesting review. A contribution touching the packet path, native FFI, lifecycle, storage, packaging, or host integration must include the corresponding integration/smoke evidence; unit tests alone are insufficient. A UI change must exercise user-visible success, empty/loading, stale/error, permission, and conflict states where applicable.

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

The verified private vulnerability-reporting channel is still owned by [M00-W01-T03](docs/tasks/m00/M00-W01-T03.md). Do not put sensitive vulnerability or appliance details into a public issue. That task must establish an actual private route and owner; this guide does not fabricate an email address or claim a supported release.
