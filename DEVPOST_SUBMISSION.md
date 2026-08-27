# Devpost submission packet

## Project name

MarqOps Evidence Layer

## Tagline

A marketing dashboard that speaks agent—verified evidence in context, with authority deliberately limited.

## Links

- Live app: https://www.marqops.com/webmcp
- Demo video: https://youtu.be/0x0P1VLcgbU
- Public repository: https://github.com/anandiyerdigital/marqops-webmcp-challenge

## Built with

WebMCP, TypeScript, Next.js, React, Supabase, Vercel, Playwright, Vitest, Google Analytics 4, Google Search Console

## Inspiration

Marketing teams do not have a dashboard shortage. They have an evidence problem.

When a client asks “What changed, why, and what should we do next?”, the answer is scattered across dashboards, exports, screenshots, and tribal knowledge. A human can slowly reconstruct the story. A browser agent can read the pixels, but pixels do not tell it which metric is authoritative, where a claim came from, or whether acting on that claim is safe.

We built MarqOps Evidence Layer around a different idea: the dashboard should expose not only numbers, but an explicit vocabulary of evidence, boundaries, and receipts. WebMCP is uniquely suited to this because the tools live beside the interface, inherit the live page and session context, and disappear when the user leaves.

## What it does

MarqOps turns a live marketing reporting workspace into a structured, page-scoped evidence surface for compatible agents.

A person can open the familiar dashboard and ask their agent to:

- inspect the reporting workspace and period;
- read an evidence-backed performance snapshot;
- trace a selected metric to Google Search Console or GA4, including its prior value and transparent change calculation;
- inspect the security manifest and enforced limits;
- recommend the next reporting action without editing data or overstating causation.

Every result includes a receipt that makes the trust boundary visible: which tool ran, what scope it used, whether it was read-only, and whether state changed. In this release, `stateChanged` is always `false`.

The public page provides five runnable, anonymized tools with no account required. Signed-in MarqOps workspaces expose six additional tenant-scoped reporting tools against the user's live reporting context.

## What people and agents can do together that was difficult before

Before WebMCP, an agent had three poor options: scrape a changing visual interface, ask the user to copy data out manually, or require a separately installed integration and credential. All three lose the shared context of the page.

With MarqOps Evidence Layer, the person and agent occupy the same workspace. The person sees the report; the agent discovers exactly the operations that are safe on that page. The agent receives structured evidence instead of guessing from layout, and the person receives an auditable receipt instead of an invisible automation step.

This makes a subtle but important collaboration possible: the agent can help interpret evidence without being granted authority to change campaigns, send reports, expose another tenant, or touch billing.

## How we built it

On the client, MarqOps checks for `document.modelContext.registerTool()` and registers narrow tool definitions with closed JSON schemas. Every schema uses `additionalProperties: false`, every tool is explicitly annotated read-only, and tool registration is tied to the page lifecycle with an `AbortController`.

The tool handler calls MarqOps' existing same-origin server logic rather than duplicating business rules in the browser. The production request path crosses seven gates:

1. compatible page-scoped agent surface;
2. strict input schema and bounded payload;
3. same-origin request policy;
4. verified authenticated session for private tools;
5. tenant-owned database query;
6. bounded output with forbidden secret-bearing fields rejected;
7. invocation receipt recorded before the response is trusted.

The public explorer uses a frozen, anonymized snapshot so judges can test the collaboration immediately. The production implementation reuses the application's existing authentication, authorization, rate limiting, event logging, and reporting services.

We tested positive behavior and negative boundaries. Cross-origin requests return 403, unsigned private calls return 401, cross-tenant resources return 404, oversized payloads return 413, and secret-shaped outputs are blocked. The full application passed 238 unit and integration checks, 400 production route builds, targeted authenticated WebMCP end-to-end tests, and public SEO/sanity checks at release time.

## Challenges we ran into

The hardest problem was not registering a tool. It was deciding what an agent must never be allowed to infer or do.

Marketing reports routinely collapse correlation into causation. “Clicks increased after the campaign changed” can quietly become “the campaign change caused the increase.” We designed the evidence tool to return source, current value, previous value, calculation, verification status, and an explicit interpretation boundary. The next-action tool is recommendation-only and tells the caller that no report, campaign, or customer record changed.

The second challenge was proving isolation. A correct happy-path demo is not enough for a multi-tenant product. We built adversarial checks around origin, authentication, tenant ownership, payload size, unexpected fields, and secret-shaped output so the implementation fails closed.

## Accomplishments that we're proud of

- This is a deployed product experience, not a disconnected technical prototype.
- Judges can test five real WebMCP tools without creating an account.
- The same design extends into authenticated, tenant-scoped reporting workflows.
- Every public tool is narrow, schema-closed, read-only, and visibly receipted.
- The interface remains useful in browsers without WebMCP support.
- The project demonstrates an evidence-native agent pattern, not merely CRUD exposed through another protocol.

## What we learned

WebMCP is most powerful when the page itself matters. It is not simply a smaller remote MCP server. The live interface, user session, page lifecycle, and human-visible result create a shared working surface that a detached API cannot reproduce.

We also learned that capability design is product design. A short list of legible, bounded verbs creates a better agent experience than exposing every backend endpoint. The best first tool is often the one that helps an agent understand context and uncertainty before it takes any action.

## What's next for MarqOps Evidence Layer

The next phase is to expand evidence coverage across paid search, SEO, and client reporting while preserving the same least-authority model. We plan to add human-reviewed draft artifacts, richer source provenance, portable evidence receipts, and policy-aware approval checkpoints before introducing any mutation-capable tool.

Our broader goal is to make every important marketing claim machine-verifiable and every consequential agent action human-governed.

## Accuracy and security disclosure

The client identity in the public demonstration is fictional and the displayed metrics are anonymized values from a verification-passed production report. They demonstrate evidence tracing and are not presented as MarqOps customer-acquisition claims.

MarqOps is security-hardened and tested, but no internet-connected product is guaranteed invulnerable. MarqOps is not currently SOC 2 audited or certified.
