# Security policy

Detew has no supported release yet. This policy describes how to report a suspected security issue in the public repository.

## Report privately

Use [GitHub's private vulnerability reporting form](https://github.com/JoseLArantes/detew/security/advisories/new). Private vulnerability reporting is enabled for this repository. A GitHub account is required; the public Security page's “Report a vulnerability” link redirects signed-out reporters to sign in before opening the private form. Do not open a public issue for an unpatched vulnerability.

Please include the affected revision or component, a concise impact description, and safe reproduction steps. Do not attach household browsing records, appliance backups, credentials, access tokens, private keys, or unrelated personal data. The project does not request diagnostic uploads and does not automatically collect them.

## Triage and disclosure

JoseLArantes is the sole maintainer and is responsible for receiving reports, coordinating triage and disclosure, reviewing dependency advisories, and preparing emergency fixes or releases. There is currently no alternate escalation contact or backup disclosure handoff. If the maintainer is unavailable, no alternate reporting route or handoff is available. The project does not guarantee a response or remediation time. Reporters should allow time for private coordination before public disclosure.

No release is currently designated as supported. When supported releases exist, this file will list the affected and fixed versions and the update path. A fix or advisory will be published only after the maintainer has prepared a coordinated disclosure.

## Current scope

The repository contains a portable development scaffold and a local UI preview. It does not yet provide an OPNsense package, packet-inspection engine, or supported firewall protection. Please do not rely on the preview to inspect traffic or apply firewall rules.
