export const METRICS = {
  impressions: { label: 'Organic search impressions', current: 319675, previous: 301340, changePercent: 6.1, source: 'Google Search Console', calculation: '(319,675 - 301,340) / 301,340 = 6.1%' },
  clicks: { label: 'Organic clicks', current: 3022, previous: 2568, changePercent: 17.7, source: 'Google Search Console', calculation: '(3,022 - 2,568) / 2,568 = 17.7%' },
  sessions: { label: 'Website sessions', current: 23658, previous: 22741, changePercent: 4.0, source: 'Google Analytics 4', calculation: '(23,658 - 22,741) / 22,741 = 4.0%' },
};

const noInput = { type: 'object', properties: {}, additionalProperties: false };
const exactKeys = (input, allowed) => {
  if (!input || Array.isArray(input) || typeof input !== 'object') throw new Error('Input must be an object.');
  if (Object.keys(input).some((key) => !allowed.includes(key))) throw new Error('Unexpected input fields.');
};

export const definitions = [
  ['marqops_demo_workspace', 'Inspect the anonymized workspace', noInput],
  ['marqops_demo_snapshot', 'Read three source-backed metrics', noInput],
  ['marqops_demo_evidence', 'Trace one metric to its source', { type:'object', properties:{ metric:{ type:'string', enum:['impressions','clicks','sessions'] } }, required:['metric'], additionalProperties:false }],
  ['marqops_demo_security', 'Read the enforced security boundaries', noInput],
  ['marqops_demo_next_action', 'Recommend a cautious next action', { type:'object', properties:{ goal:{ type:'string', enum:['growth','efficiency','client_reporting'] } }, required:['goal'], additionalProperties:false }],
].map(([name, description, inputSchema]) => ({ name, description, inputSchema, annotations:{ readOnlyHint:true, untrustedContentHint:false } }));

export function execute(name, input = {}) {
  if (!definitions.some((tool) => tool.name === name)) throw new Error('Unknown tool.');
  if (name === 'marqops_demo_evidence') {
    exactKeys(input, ['metric']);
    if (!Object.hasOwn(METRICS, input.metric)) throw new Error('Unsupported metric.');
    return { metric: METRICS[input.metric], evidenceStatus:'verified', interpretationBoundary:'The source verifies the observation and change, not sole causation.' };
  }
  if (name === 'marqops_demo_next_action') {
    exactKeys(input, ['goal']);
    const recommendations = {
      growth:'Inspect the landing pages behind the click increase before expanding content.',
      efficiency:'Compare organic-click and session growth before changing spend.',
      client_reporting:'Lead with verified gains, cite each source, and avoid unsupported attribution.',
    };
    if (!Object.hasOwn(recommendations, input.goal)) throw new Error('Unsupported goal.');
    return { goal:input.goal, recommendation:recommendations[input.goal], stateChanged:false, caveat:'Recommendation only. No report, campaign, or customer record was changed.' };
  }
  exactKeys(input, []);
  if (name === 'marqops_demo_workspace') return { workspace:'Anonymized production workspace', period:'July 2026', availableMetrics:Object.keys(METRICS), mutationsAvailable:false };
  if (name === 'marqops_demo_snapshot') return { disclosure:'Identity removed. Values come from a verification-passed production report.', metrics:Object.values(METRICS) };
  return { scope:'read-only', boundaries:['page-scoped registration','strict schemas','bounded anonymized outputs','non-mutating tools'], qualification:'Security-hardened and tested; no internet-connected product is guaranteed invulnerable.' };
}

export function invoke(name, input = {}) {
  return { data:execute(name,input), receipt:{ invocationId:crypto.randomUUID(), readOnly:true, stateChanged:false }, trustBoundary:'Frozen, anonymized public snapshot.' };
}

for (const tool of definitions) {
  if (typeof document !== 'undefined' && typeof document.modelContext?.registerTool === 'function') {
    await document.modelContext.registerTool({ ...tool, execute:(input) => invoke(tool.name,input) });
  }
}

if (typeof window !== 'undefined') {
  const support = document.querySelector('#support');
  support.textContent = typeof document.modelContext?.registerTool === 'function' ? 'WebMCP detected - five tools available' : 'Human preview - enable WebMCP to expose site tools';
  const toolList = document.querySelector('#tools');
  definitions.forEach((tool) => {
    const button = document.createElement('button');
    button.className = 'tool'; button.textContent = tool.name.replace('marqops_demo_','');
    toolList.append(button);
  });
  const prompts = {
    snapshot:{ question:'What changed in this reporting period?', tool:'marqops_demo_snapshot', input:{} },
    evidence:{ question:'Show me the evidence behind organic-click growth.', tool:'marqops_demo_evidence', input:{metric:'clicks'} },
    next:{ question:'What should the client report say next?', tool:'marqops_demo_next_action', input:{goal:'client_reporting'} },
  };
  let selected = prompts.snapshot;
  document.querySelectorAll('[data-prompt]').forEach((button) => button.addEventListener('click', () => { selected=prompts[button.dataset.prompt]; document.querySelector('#question').textContent=selected.question; }));
  document.querySelector('#run').addEventListener('click', () => {
    const result=invoke(selected.tool,selected.input); const data=result.data;
    document.querySelector('#answer').textContent = data.recommendation || (data.metric ? `${data.metric.label} rose ${data.metric.changePercent}% and is verified against ${data.metric.source}.` : `Clicks rose 17.7%, impressions 6.1%, and sessions 4.0%.`);
    document.querySelector('#receipt').innerHTML=`<div><dt>tool</dt><dd>${selected.tool}</dd></div><div><dt>request</dt><dd>${result.receipt.invocationId}</dd></div><div><dt>access</dt><dd>read-only</dd></div><div><dt>state changed</dt><dd>false</dd></div>`;
  });
}
