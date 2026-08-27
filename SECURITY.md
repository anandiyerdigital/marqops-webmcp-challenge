# Security model

This public reference implementation contains only a frozen, anonymized dataset and read-only tools. Its core safeguards are:

- page-scoped registration with lifecycle cleanup in the production build;
- `readOnlyHint: true` on every tool;
- closed JSON schemas with `additionalProperties: false`;
- explicit allowlists for metrics and decision goals;
- no create, update, send, publish, billing, credential, or destructive tools;
- outputs that contain no personal identifiers, authentication material, or customer IDs;
- receipts that state whether anything changed.

The production MarqOps implementation additionally enforces same-origin requests, authentication for private tools, tenant-owned queries, bounded payloads, rate limits, output-policy checks, durable event receipts, and cross-tenant negative tests.

Security-hardened does not mean invulnerable. MarqOps is not currently SOC 2 audited or certified. Please report suspected vulnerabilities privately through the contact route on marqops.com rather than opening a public issue.

