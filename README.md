# MarqOps: the evidence layer for agent-native marketing reporting

[Live experience](https://www.marqops.com/webmcp) · [Demo video](https://youtu.be/0x0P1VLcgbU) · [Security model](SECURITY.md)

Marketing dashboards were designed for humans to click through, not for agents to understand. An agent can read pixels, but pixels do not tell it which metric is authoritative, where a claim came from, or whether an action is safe.

MarqOps uses WebMCP to turn a live reporting workspace into a narrow, structured evidence surface. A person keeps the familiar dashboard while their agent can inspect the same signed-in context, trace a metric to its source, and prepare a cautious next action. The agent does not need credentials copied into a separate integration and does not guess its way through the UI.

## What people and agents can do together

1. The person opens the live reporting workspace.
2. The agent discovers page-scoped tools through `document.modelContext.registerTool()`.
3. It reads a bounded snapshot instead of scraping the dashboard.
4. It traces a selected claim to Google Search Console or GA4 evidence and sees the calculation.
5. It recommends report language while preserving the distinction between observation and causation.
6. The person verifies the tool receipt and remains in control.

The public experience exposes five anonymized, read-only tools. The signed-in product adds six tenant-scoped reporting tools. No WebMCP tool sends reports, edits campaigns, changes billing, or mutates customer records.

## Why WebMCP matters here

Without WebMCP, an agent must interpret changing layouts, scrape visible text, or receive a separate API credential. With WebMCP, MarqOps defines the task vocabulary and security boundary on the page itself. Inputs are narrow, outputs are evidence-shaped, and tool availability follows the live page and signed-in session.

## Run locally

Requirements: Node.js 20 or newer.

```bash
npm test
npm start
```

Open `http://localhost:4173`. For native site-tool discovery, use ChatGPT's compatible built-in browser or enable WebMCP testing in Chrome. The interface remains usable as a human preview in other browsers.

## Implementation

`src/webmcp.js` contains the complete runnable reference:

```js
await document.modelContext.registerTool({
  name: 'marqops_demo_evidence',
  description: 'Trace one reporting metric to its source.',
  inputSchema: {
    type: 'object',
    properties: {
      metric: { type: 'string', enum: ['impressions', 'clicks', 'sessions'] },
    },
    required: ['metric'],
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true, untrustedContentHint: false },
  execute: (input) => invoke('marqops_demo_evidence', input),
});
```

The production route executes the same contracts server-side and adds origin validation, bounded JSON parsing, rate limiting, output scanning, authenticated tenant ownership, and durable invocation receipts. The commercial application remains private; this repository intentionally publishes the complete challenge reference experience without credentials, customer data, or unrelated proprietary code.

## Anonymized demonstration data

The frozen July 2026 example uses three verification-passed report values with the client identity removed: 319,675 organic impressions (+6.1%), 3,022 organic clicks (+17.7%), and 23,658 sessions (+4.0%). These figures demonstrate evidence tracing; they are not presented as MarqOps customer-acquisition claims.

## Test coverage

The included dependency-free test suite verifies:

- all five tools are marked read-only;
- every schema rejects additional properties;
- unknown tools and enum values fail closed;
- evidence contains no identity or credential-shaped fields;
- recommendations explicitly report `stateChanged: false`.

Run it with `npm test`.

## License

MIT. See [LICENSE](LICENSE).
