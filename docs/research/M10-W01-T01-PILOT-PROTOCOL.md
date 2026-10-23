# M10-W01-T01 — Administrator interviews and independent pilot protocol

**Version:** Draft 0.1 · Planning only
**Date:** October 23, 2026
**Reviewed baseline:** `173bff337b958a6da4c4585502f806613806c75a`
**Owner:** Product Owner JoseLArantes
**Independent project reviewer:** PR Review Architect (review pending)
**Status:** No recruitment, real-data collection, or installation is authorized by this draft.

This protocol plans neutral research for [M10-W01-T01](../tasks/m10/M10-W01-T01.md) and [issue #118](https://github.com/JoseLArantes/detew/issues/118). It follows [PRD UX-01–03 and PRI-01/03](../PRD.md#9-ui-and-experience-requirements), [PRODUCT §§1.1, 13.3, and 14.1](../PRODUCT.md#1-positioning-and-operating-context), [ARCHITECTURE §§12.5 and 14.1](../ARCHITECTURE.md#12-frontend-architecture), and ARC-01/11. It is a planning artifact, not a human-subjects approval, study result, product outcome, or milestone/gate acceptance.

## 1. Study purpose and boundaries

Learn how OPNsense administrators manage access today, what makes category controls understandable or difficult, how they recognize the effect of a change, and why they would keep or remove a filtering workflow. Ask about categories and current approaches without assuming that Detew solves the problem. Record tool classes and tasks, not commercial product names.

The study has separate counts and decisions:

| Activity | Planning target | What it can support |
|---|---:|---|
| Administrator discovery interviews | At least 10 administrators across household and small-organization settings | Need, current workflow, constraints, category priorities, and keep/remove reasons. These are qualitative findings, not a representative market estimate. |
| Founder-environment pre-pilot | One separately documented precursor environment, if authorized and ready | A step before independent-site pilots. It does not count toward the five sites. This draft does not schedule or authorize it. |
| Independent pilot sites | At least five distinct sites after the founder-environment stage and after M09 readiness acceptance | Consented repeated-use evidence on the accepted candidate. Each site is counted once and separately from interview participants. |
| Timed usability study | PRD §9.3's separate non-developer participant gate | Do not count an interview or pilot toward this gate unless it independently meets that study's sample and task criteria. |

Interviews and synthetic prototype walkthroughs may be planned before M09 without installing software or inspecting live traffic. Every real gateway installation, including a founder-environment or independent-site install, must wait for an accepted [M09-W06-T02 readiness decision](../tasks/m09/M09-W06-T02.md) and its site-specific authorization and recovery plan. This protocol cannot waive that dependency.

## 2. Sampling plan

### Administrator interviews

Recruit at least 10 people who currently administer an OPNsense installation in a household or small organization. Aim for five from each setting; if the final mix differs, report the actual counts and do not describe the sample as balanced. Do not count Detew developers, project maintainers, the founder, or the founder's environment toward this target.

Use purposive variation within that total: occasional and frequent administrators; different self-described experience levels; a range of device-count bands; and, where available, varied network complexity such as IPv6, VLANs, multiple WANs, or managed endpoints. Ask for broad descriptions only. Do not request exact addresses, hostnames, credentials, configuration exports, packet captures, or browsing history. Recruit through more than one channel where practical and record only the broad source class, not account handles.

The sample is intended to expose different workflows and constraints, not estimate population percentages. Report the number screened, eligible, consented, completed, and withdrawn without publishing personal identifiers. Any imbalance or recruitment limitation stays visible in the report.

Proposed eligibility restriction: participants are adults (18 or older) who administer the target OPNsense environment. Do not recruit minors or people who cannot provide their own informed consent under the approved protocol. A household member, employee, or other person whose device may be affected is not thereby a participant; do not observe their activity or collect their identifiers. A qualified research owner and the Product Owner must review this restriction before it appears in an invitation.

### Independent pilot sites

Plan for at least five distinct sites after the founder-environment stage. A site counts only when it has a distinct site owner and locally authorized administrator, a distinct OPNsense network environment, separate consent, and a separately documented pilot. Count no more than one site for the same administrator-controlled network. A second location under one organization is not automatically independent. The founder, project contributors, and any founder-controlled environment do not count toward five.

Aim for coverage of both household and small-organization settings and different network constraints. If a setting cannot be recruited safely, report the gap rather than relaxing the independence rule. Do not place names, locations, network identities, or candidate participants in this repository.

Recruitment channels are proposed for later review only: a public project invitation, OPNsense administrator communities, open-source network-administration groups, local home-networking groups, and small-organization IT communities. Follow each community's posting rules, disclose the project relationship, use a neutral invitation, and avoid pressuring existing contributors or support requesters. No invitation, post, direct message, or gateway contact has been made.

## 3. Interview guide

Start with open questions and let the administrator describe their own terms. Ask the category prompts only after the open exploration; do not name products or suggest that Detew is successful. Use neutral follow-ups such as “What happened next?”, “What did you expect?”, and “How did you decide?”

1. “Tell me about a recent time you needed to manage what a device or group of devices could access.”
2. “What led you to make a change? What did you do, step by step?”
3. “What result did you expect, and how did you tell whether it happened?”
4. “Where, if anywhere, did you have difficulty deciding what to change or finding the relevant control?”
5. “How do you currently group or describe the kinds of access you want to manage?”
6. “What categories or applications, if any, matter to you? What belongs at the edge of each category?” After the open answer, use the required examples—Adult content, Games, and AI services—only as neutral coverage probes, along with “other” and “none.”
7. “What approaches or tool types do you use today, if any? What does each help with, and where does it fall short?” Record broad classes such as native firewall controls, DNS filtering, network add-ons, endpoint controls, proxy services, manual rules, or none; do not transcribe vendor names.
8. “What network or device constraints affect this workflow?” Ask only for general characteristics such as household versus small organization, IPv6/VLAN/multi-WAN presence, or hardware-resource limits. Do not request exact topology or configuration.
9. “What makes a false block noticeable? What do you do when something needed is blocked?”
10. “What information would you need before enabling a change, and what evidence would help you understand its result?”
11. “What privacy or operational concerns would make you avoid this kind of filtering?”
12. “What would make you keep using a filtering workflow? What would make you stop or remove it?”
13. “What did I not ask that matters to how you manage access?”

If a synthetic prototype walkthrough is later approved, give the participant a fictional site, profile, and device. Ask them to narrate what they think a control will do, how they would verify it, and what they would do after a block. Do not claim the prototype enforces traffic. This walkthrough is exploratory and does not replace the timed usability gate.

## 4. Repeat-use plan

Proposed internal planning interval: **seven consecutive calendar days** after a pilot site's installation readiness and explicit consent. The interval covers a normal weekly pattern without setting an active-time estimate. Participants may use the system as part of their ordinary administration; do not ask them to generate traffic, perform a minimum number of tasks, or leave collection enabled. At debrief, ask for examples of naturally occurring return use and record the participant-reported number of distinct use occasions only if they choose to provide it.

The seven-day interval is a study-design proposal, not a public participant promise or a product-retention success threshold. A qualified research owner must validate the interval and include it in approved consent language before recruitment. Do not invent a minimum return count or pass/fail retention percentage. If repeated use is not observed, record that plainly as a result; do not prompt artificial use or call it success.

The interview duration, pilot active-time estimate, compensation, data-retention duration, and withdrawal cutoff are **unset**. Do not put estimates or guarantees in an invitation until a qualified researcher has dry-run the protocol and the Product Owner has approved the participant-facing terms. No real data collection may begin while the retention/deletion schedule or withdrawal cutoff is unset.

## 5. Consent, withdrawal, and observation

Before any interview, obtain plain-language consent that explains the study purpose; voluntary participation; the questions and synthetic tasks; what notes are recorded; what is not collected; the seven-day proposed pilot interval if applicable; foreseeable privacy and operational risks; how findings may appear in public reports; and how to withdraw. Do not imply security certification, protection guarantees, or that participation will improve a participant's network.

This is a consent-content checklist, not a ready-to-use consent form. Before recruitment, a qualified research owner must convert it into participant-facing language, add the approved session-time estimate and data-lifecycle terms, and have the Product Owner and appropriate reviewer approve it. Do not obtain consent using this draft alone.

Use separate affirmative choices for interview notes, audio/video recording, any screen capture, and a later pilot installation. Recording and screen capture are off by default and are not required to participate. If a choice is declined, proceed only with the consented activity and permitted notes. If interview consent is declined, stop before collecting answers and do not retain an identity-linked refusal reason.

Give each consented participant a study code. A separate scheduling/contact record, if later required, must be held outside the repository with restricted access; never mix it with research notes. Before recruitment, the research owner and Product Owner must approve the retention/deletion schedule, data access list, withdrawal cutoff, and deletion procedure. Until those values are explicit and communicated in consent, this draft collects no real information.

Withdrawal is allowed at any time without penalty. On withdrawal, stop the interview or study activity and any further observation. Do not change a live gateway remotely; the site administrator remains in control of operational changes. Remove linkable raw notes or recordings when requested under the approved deletion procedure. Explain before consent when already de-identified, aggregated findings can no longer be separated. Do not promise removal after aggregation until the cutoff and aggregation process are approved and disclosed.

Observe only the consented research task. No background observation, hidden telemetry, packet capture, browsing-history review, or export of appliance activity is allowed by this protocol. Prefer synthetic fixtures and moderator notes about task steps, expectations, mistakes, assistance, and participant-stated reasons. Do not retain hostnames, IP/MAC addresses, SSIDs, credentials, exact rules, device/person names, URLs, browsing records, or private screenshots. Any use of product-local data would require a separate reviewed plan and specific opt-in; this draft does not authorize it.

## 6. Incidental sensitive data and public reporting

If sensitive information appears unexpectedly, pause the task, stop any recording, close or obscure the content, and explain that it is not needed. Do not copy it into notes. If it entered an approved recording or artifact, quarantine access and follow the pre-approved deletion procedure; record only a coded “redaction event,” never the sensitive content. Escalate any possible exposure to the research owner and privacy reviewer using the approved process. Recruitment remains blocked until the responsible people and handling procedure are identified.

Use broad categories and paraphrased findings in public reporting. Remove names, contact details, organization and community names, precise locations, topology, addresses, device labels, URLs, and combinations that could identify a small site. Do not publish raw notes, recordings, configuration, activity, or participant quotes without separate explicit permission and a privacy review. Synthetic examples must be marked synthetic and must never be counted as study results.

## 7. Moderator assistance and keep/remove decisions

Use a consistent assistance ladder and record the highest level reached for each task:

| Level | Moderator action | Evidence label |
|---|---|---|
| A0 | Read the task prompt, then remain quiet. | Unassisted attempt |
| A1 | Repeat the prompt or ask a neutral question such as “What would you look for next?” | Neutral prompt |
| A2 | Give a standard procedural hint that does not name the control or outcome. | Assisted attempt |
| A3 | Point to a control, explain its meaning, or complete a step. | Moderator-directed; not independent completion |

Assistance is not participant failure. Record where the interface or instructions required it; do not turn a coached completion into an independent success. If an unsafe operational action is proposed, stop the task and use the synthetic scenario to explain the limit.

For each finding, record the task/context, participant code, broad setting, observed friction or benefit, assistance level, severity, linked PRD requirement, and whether the evidence was observed or participant-reported. Do not count a small qualitative sample as a frequency estimate.

- **Keep or refine** a concept when it addresses a stated need, participants can understand its scope and consequence, and it remains compatible with policy consistency, privacy defaults, accessibility, and operational safety.
- **Remove or defer** a concept when it implies unverified enforcement, creates avoidable privacy exposure or unsafe actions, depends on unavailable visibility, conflicts with an accepted contract, or adds complexity without a demonstrated job.
- Escalate any finding that challenges an accepted requirement or architecture decision to the Product Owner; researchers do not silently change product semantics.
- A single severe safety/privacy confusion may justify a stop-and-review even when it is not common. Do not invent a numeric severity or frequency threshold in this protocol.

## 8. Pilot-site readiness checklist

All items below must be satisfied before an actual pilot installation. An interview or synthetic walkthrough does not satisfy them.

- [ ] M09-W06-T02 / issue #117 has an accepted readiness decision for the exact candidate; its current blocked state is not waived by this protocol.
- [ ] The founder-environment stage has a separate documented outcome; it is excluded from the five independent-site count.
- [ ] The site has a distinct owner and administrator, written authorization, separate consent, and a non-founder-controlled network.
- [ ] The exact supported hardware/topology is within the accepted candidate envelope; unsupported or unknown cases are excluded and recorded without private configuration details.
- [ ] Backup, recovery, maintenance window, rollback/removal, and site-admin stop controls are reviewed for that site under M09 evidence.
- [ ] No experiment can interrupt essential connectivity; the site administrator may stop immediately and controls all changes.
- [ ] Product collection is local and minimized; the study does not extract traffic history, packet payloads, hostnames, addresses, credentials, or full configuration.
- [ ] The consent, retention/deletion schedule, withdrawal cutoff, participant time estimate, and incidental-data handling are approved and disclosed.
- [ ] A qualified research owner and appropriate privacy/ethics reviewer are named; applicable jurisdictional review requirements have been checked by qualified people.

Any unchecked item blocks installation. If readiness is rejected or unavailable, continue only with authorized interviews or synthetic prototype work and report the pilot as not run. Do not describe the site as protected, supported, or a successful pilot.

## 9. Synthetic dry-run results

Dry-run inputs below are invented, clearly synthetic, and not participant evidence. The walkthrough checks the written handling rules only.

| Scenario | Synthetic input | Expected handling | Observed dry-run result |
|---|---|---|---|
| No consent | `SYN-H01` declines before the first question. | Stop before collecting answers or identity-linked refusal reason; do not proceed with prototype or recording. | The script stops at consent. No interview note is created; the aggregate completion count can record “not consented” only if the approved study data plan allows it. |
| Withdrawal | `SYN-S02` withdraws during the proposed pilot window and asks to leave. | Stop study observation; give no penalty; do not mutate the gateway; mark the coded record withdrawn and follow only the pre-approved raw-data deletion/aggregation rule. | The withdrawal flow stops. Because the schedule/cutoff is still unset, the dry-run flags real collection as blocked rather than promising a deletion deadline. |
| Sensitive incidental data | A fictional page shows `device-family-7` and `https://private.example/path?token=synthetic`. | Stop capture, hide the fixture, do not copy fields, discard/quarantine any artifact under the approved procedure, record only a coded redaction event. | The example is reduced to “redaction event”; the synthetic hostname/path/token are absent from the report output. |
| Moderator assistance | `SYN-H03` cannot locate a fictional category control; moderator gives the standard procedural hint. | Record A2, preserve the participant's own words, and do not label the task unassisted. | The result is marked assisted; it is not counted as independent completion. |
| Founder/site independence | A hypothetical fifth location belongs to the same admin-controlled network as the founder environment. | Do not count it as an independent site. Require a distinct site owner/admin and network, separate consent, and post-founder ordering. | The candidate is excluded from the five-site count. |

Dry-run disposition: the consent, withdrawal, incidental-data redaction, assistance, and independent-site rules are understandable on paper. This does not verify a production collection system or qualify the researcher. The real-data collection blocker remains open.

## 10. Open blockers before recruitment or installation

| Blocker | Required resolution | Current disposition |
|---|---|---|
| Researcher qualification | Product Owner names a researcher with relevant moderated-interview and privacy/data-handling experience; a qualified independent reviewer evaluates the protocol. | Unverified in the current assignment; recruitment and real-data collection blocked. PR Review Architect project review does not establish researcher qualification. |
| Ethics/privacy applicability | Qualified people determine the review and privacy requirements for the study jurisdiction and document any required approval. | Not assessed; no compliance claim. Recruitment blocked. |
| Participant terms | Dry-run and approve the session time estimate, proposed seven-day window, compensation policy if any, consent language, and withdrawal cutoff. | Unset; no participant-facing promise or invitation. |
| Data lifecycle | Approve purpose, access, retention/deletion schedule, storage location, breach/escalation contact, and aggregation procedure. | Unset; no real data collection. |
| Pilot installation readiness | Accept M09-W06-T02 for the exact candidate, then complete the site-specific checklist. | M09-W06-T02 / #117 is currently open and `status:blocked`; no installations. |

## 11. Limits and traceability

This draft does not recruit or contact anyone, collect real answers, view real appliance data, or install software. It records no pilot outcome, retention rate, success threshold, supported environment, product readiness, or gate acceptance. The administrator sample is qualitative; the five-site target is a plan and cannot be claimed as achieved until independent sites complete the separately approved protocol.

| Contract | Protocol section |
|---|---|
| PRD UX-01–03 | Interview guide; fictional walkthrough; moderator assistance |
| PRD PRI-01/03 | Consent, observation minimization, incidental-data handling, public reporting |
| PRODUCT §§1.1, 13.3, 14.1 | Study purpose; privacy; participant-facing scope |
| ARCHITECTURE §§12.5, 14.1; ARC-01/11 | Walkthrough boundaries; untrusted inputs; no claim that prototype or mock proves integration |
| PRD validation/stop conditions | Ten-admin sample, five independent sites, repeat-use observations, false-block and product-direction questions |
| M09-W06-T02 / issue #117 | Hard prerequisite for every pilot installation |
