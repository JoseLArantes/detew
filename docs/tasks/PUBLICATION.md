# Backlog publication record

**Verified:** October 2, 2026, 23:49 UTC. This is the creation snapshot; current issue status is maintained in GitHub.

The detailed development backlog was published to [JoseLArantes/detew](https://github.com/JoseLArantes/detew/issues). Every task has one issue containing its complete specification, acceptance criteria, required validation, evidence, foundation references, and direct prerequisites.

| Item | Verified result |
|---|---|
| Tasks / unique GitHub issues | 157 / 157 |
| Milestones / work packages | 14 / 71 |
| Native blocking relationships | 356 |
| Management labels | 36 across type, area, priority, scope, status, and size |
| Task scope | 137 V1; 10 T1; 10 ecosystem |
| Requirement coverage | 73 V1; 7 T1; 4 ecosystem; all 84 mapped |
| Initial workflow | 4 ready; 133 blocked; 20 deferred |

## Verification evidence

- `python3 docs/tasks/manage.py validate`: complete requirement/work-package coverage, valid IDs/scopes/anchors, generated task parity, and acyclic dependencies.
- `python3 docs/tasks/manage.py verify`: actual remote titles, complete bodies, managed labels, assigned milestones, and all native blocking relationships match the catalog; zero mismatches.
- Separate remote inventory: exactly one task marker per task, no duplicate task issues, all 36 management labels present, and no extra non-task issues at verification.
- Documentation review: local files/anchors and Markdown links pass; all 84 PRD requirement definitions remain unchanged; `git diff --check` passes.
- Validator negative cases: duplicate ID, cycle, unknown requirement, missing anchor, wrong scope, and unknown dependency were rejected.

The [publication crosswalk](github.json) records actual issue/milestone identities and native edges. Foundation links in issue bodies use repository baseline `0a732d37da46571af7e3eeb8e293fd3fd4fa5b74`. Task source files and generated local views are connected through the [backlog guide](README.md).

## Initially eligible work

| Task | Outcome | GitHub |
|---|---|---|
| [M00-W01-T01](m00/M00-W01-T01.md) | Decide the software license and dependency admission policy | [#1](https://github.com/JoseLArantes/detew/issues/1) |
| [M00-W03-T01](m00/M00-W03-T01.md) | Specify the isolated dual-stack lab and console recovery plan | [#7](https://github.com/JoseLArantes/detew/issues/7) |
| [M00-W05-T01](m00/M00-W05-T01.md) | Review the threat model and privilege/trust inventory | [#11](https://github.com/JoseLArantes/detew/issues/11) |
| [M10-W01-T01](m10/M10-W01-T01.md) | Design administrator interview pilot and ethics protocol | [#118](https://github.com/JoseLArantes/detew/issues/118) |

Confirm owner, reviewer, current inputs, and entry conditions before starting. The backlog establishes planned work; implementation, product tests, compatibility, and release gates remain unstarted/unverified.
