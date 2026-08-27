import test from 'node:test';
import assert from 'node:assert/strict';
import { definitions, execute, METRICS } from '../src/webmcp.js';

test('exposes five narrow read-only WebMCP tools', () => {
  assert.equal(definitions.length, 5);
  assert.ok(definitions.every((tool) => tool.annotations.readOnlyHint === true));
  assert.ok(definitions.every((tool) => tool.inputSchema.additionalProperties === false));
  assert.doesNotMatch(definitions.map(({name}) => name).join(' '), /send|publish|delete|checkout|apply/);
});

test('rejects tool overreach and unsupported inputs', () => {
  assert.throws(() => execute('marqops_demo_evidence', { metric:'clicks', tenantId:'other' }), /Unexpected/);
  assert.throws(() => execute('marqops_demo_evidence', { metric:'revenue' }), /Unsupported/);
  assert.throws(() => execute('marqops_demo_delete', {}), /Unknown/);
});

test('returns transparent evidence without identity fields', () => {
  const result=execute('marqops_demo_evidence',{metric:'clicks'});
  assert.equal(result.metric.current,3022);
  assert.equal(result.metric.source,'Google Search Console');
  assert.equal(METRICS.clicks.calculation,'(3,022 - 2,568) / 2,568 = 17.7%');
  assert.doesNotMatch(JSON.stringify(result),/email|token|credential|customerId|userId/i);
});

test('keeps recommendations explicitly non-mutating', () => {
  const result=execute('marqops_demo_next_action',{goal:'client_reporting'});
  assert.equal(result.stateChanged,false);
  assert.match(result.caveat,/No report, campaign, or customer record was changed/);
});

