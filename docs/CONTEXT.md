# Detew domain language

Detew controls web and application access for devices on a network. These definitions give the product, its policies, and its explanations one shared vocabulary across home, business, and organizational use.

## Scope and people

**Site**: A network environment with a shared administration boundary and site-wide filtering settings.
_Avoid_: Tenant, household, cluster as interchangeable names for a site.

**Device**: A network endpoint to which traffic can be attributed using recorded evidence.
_Avoid_: User, identity, IP address as synonyms for a device.

**Device group**: A named collection of devices used to assign filtering behavior.
_Avoid_: Policy group, role.

**Attribution**: The evidence-backed association between a flow and a device or network scope at a particular time.
_Avoid_: Authentication when the association comes only from network observations.

## Policy

**Profile**: A reusable set of content controls, exceptions, schedules, and behavior for insufficiently classified traffic.
_Avoid_: Rule, plan, security level as synonyms for a profile.

**Assignment**: A binding between a device, device group, or network scope and one profile, with explicit precedence.
_Avoid_: Rule when referring to a profile assignment.

**Site guardrail**: A mandatory site-wide restriction that profile exceptions cannot override.
_Avoid_: Hidden rule, global exception.

**Category**: A defined topic label attached to a destination by a category dataset.
_Avoid_: Application, threat score, safety rating as synonyms for a category.

**Application**: A network service or application protocol recognized through qualifying classification evidence. Generic transport recognition alone is not application identity.
_Avoid_: Category, website as interchangeable names for an application.

**Exception**: An explicit, scoped allow or block instruction for a destination or application within a profile.
_Avoid_: Whitelist, blacklist, bypass as synonyms for an exception.

**Schedule**: A time condition that activates a named subset of a profile's controls.
_Avoid_: Timer when referring to recurring policy periods.

**Temporary override**: A time-limited change to a device's assigned profile or profile-level exception behavior.
_Avoid_: Emergency bypass, site disable as synonyms for a temporary override.

## Inspection and explanations

**Flow**: A tracked bidirectional network conversation within an inspection scope and transport lifetime.
_Avoid_: Packet, request, browsing visit as synonyms for a flow.

**Classification**: The recorded interpretation of a flow's protocol, destination, or application, including its evidence and limitations.
_Avoid_: Decryption, content reading as synonyms for classification.

**Visibility**: The information available to classification at an inspection point.
_Avoid_: Protection score, coverage percentage without a defined denominator.

**Insufficient classification**: A state in which available, eligible evidence cannot resolve a dimension required by the effective profile.
_Avoid_: Engine failure, allowed traffic, uncategorized as interchangeable names for this state.

**Provisional inspection**: A bounded period of evidence gathering before a flow's classification is resolved or its declared limit is reached.
_Avoid_: Confirmed allow, full content inspection.

**Inspection scope**: The selected interfaces and network paths on which Detew observes or enforces flow decisions.
_Avoid_: Protected network when enforcement coverage has not been verified.

**Observe mode**: A mode that computes Detew traffic-policy decisions without enforcing those decisions.
_Avoid_: Enforce mode, inspection bypass as interchangeable names for observation.

**Enforce mode**: A mode that applies Detew traffic-policy decisions on a verified supported inspection scope.
_Avoid_: Universal protection, successful connection.

**Policy decision**: The result of evaluating Detew's controls against a flow's recorded context.
_Avoid_: Delivered traffic, firewall result as synonyms for a Detew policy decision.

**Enforcement outcome**: The observed action taken by Detew for a policy decision.
_Avoid_: Decision when referring to a confirmed action or an enforcement failure.

**Decision record**: An explanation linking a policy decision and enforcement outcome to their profile, evidence, time, and runtime revisions.
_Avoid_: Packet capture, browsing history as synonyms for a decision record.

## Configuration and data

**Desired configuration**: The saved filtering intent selected by an administrator.
_Avoid_: Active configuration unless runtime activation has been confirmed.

**Active configuration**: The filtering intent represented by a runtime bundle confirmed as applied across the required inspection workers. It can differ from desired configuration.
_Avoid_: Draft, saved setting, newest candidate.

**Runtime bundle**: An immutable, validated combination of configuration, classification data, and capability versions used for policy evaluation.
_Avoid_: Rules file, configuration hash as synonyms for a runtime bundle.

**Activation**: The coordinated transition to a prepared runtime bundle at the inspection engine.
_Avoid_: Save, apply request as synonyms for confirmed activation.

**Category dataset**: A versioned collection of destination-to-category labels with source and licensing provenance.
_Avoid_: Threat feed, application signatures as interchangeable names for category data.

**Category eligibility**: Whether a category label's source and validity permit its use in the current evaluation context.
_Avoid_: Data download success, freshness badge as synonyms for eligibility.

**Provider**: A replaceable source of category data or classification information with declared capabilities and provenance.
_Avoid_: Module when referring only to a source of data.

**Module**: An optional product capability with a defined lifecycle and compatibility contract.
_Avoid_: Provider, service, microservice as synonyms for a module.

**Inspection bypass**: A state in which selected traffic continues through OPNsense without Detew enforcement.
_Avoid_: Allowed, protected when inspection is bypassed.
