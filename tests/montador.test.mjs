import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeBuild, buildMessage, whatsappUrl } from '../montador-engine.mjs';
import { PRESETS, normalizeBuild, EMPTY_BUILD } from '../montador-data.mjs';
const ids = issues => issues.map(item => item.id);
const gaming = { ...PRESETS.jogos.values };

test('an empty selection stays incomplete and has no compatibility approvals', () => {
  const result = analyzeBuild({});
  assert.equal(result.completed, 0);
  assert.equal(result.status, 'Configuração em construção');
  assert.equal(result.checks.length, 0);
});
test('starting configurations contain no hard conflicts and still require review', () => {
  for (const preset of Object.values(PRESETS)) {
    const result = analyzeBuild(preset.values);
    assert.deepEqual(result.errors, [], preset.label);
    assert.equal(result.completed, 8);
    assert.match(result.status, /revisão/);
    assert.ok(ids(result.warnings).includes('bios'));
    assert.ok(ids(result.warnings).includes('psu-model'));
  }
});
test('different CPU sockets are rejected even within the Core i5 family', () => {
  const result = analyzeBuild({ ...gaming, cpu: 'i5-10400f' });
  assert.ok(ids(result.errors).includes('socket'));
  assert.ok(!ids(result.checks).includes('socket'));
});
test('DDR4 and DDR5 are checked against the board and processor independently', () => {
  assert.ok(ids(analyzeBuild({ ...gaming, ram: 'd5-32' }).errors).includes('memory'));
  assert.ok(ids(analyzeBuild({ ...PRESETS.am5.values, motherboard: 'outro', ram: 'd4-32' }).errors).includes('memory'));
  const intelD5 = analyzeBuild({ ...gaming, motherboard: 'b760d5', ram: 'd5-32' });
  assert.ok(!ids(intelD5.errors).includes('memory'));
});
test('F processors and Ryzen 5600 cannot use motherboard video as integrated graphics', () => {
  for (const cpu of ['i5-10400f', 'i5-12400f', 'i5-14400f', 'r5-5600']) {
    assert.ok(ids(analyzeBuild({ cpu, gpu: 'integrado' }).errors).includes('no-video'), cpu);
  }
  for (const cpu of ['r5-5600g', 'r5-7600']) assert.ok(!ids(analyzeBuild({ cpu, gpu: 'integrado' }).errors).includes('no-video'));
});
test('an unknown CPU never receives an integrated-video approval', () => {
  const result = analyzeBuild({ cpu: 'outro', gpu: 'integrado' });
  assert.ok(!ids(result.checks).includes('video'));
  assert.ok(ids(result.warnings).includes('unknown-parts'));
});
test('ATX board does not fit the compact mATX profile', () => {
  assert.ok(ids(analyzeBuild({ motherboard: 'b550atx', case: 'matx' }).errors).includes('case-size'));
  assert.ok(ids(analyzeBuild({ motherboard: 'b550atx', case: 'atx' }).checks).includes('case-format'));
});
test('RTX 3070 below 650 W triggers reference warning, not a false exact consumption', () => {
  const under = analyzeBuild({ ...gaming, psu: '550' });
  assert.ok(ids(under.warnings).includes('psu-low'));
  assert.ok(!ids(under.checks).includes('psu-reference'));
  const adequate = analyzeBuild(gaming);
  assert.ok(ids(adequate.checks).includes('psu-reference'));
  assert.ok(ids(adequate.warnings).includes('psu-model'));
});
test('no storage and no cooler are flagged; HDD-only gets an SSD suggestion', () => {
  const none = analyzeBuild({ ...gaming, nvme: 'nenhum', cooler: 'nenhum' });
  assert.ok(ids(none.errors).includes('no-storage'));
  assert.ok(ids(none.errors).includes('no-cooler'));
  const hdd = analyzeBuild({ ...gaming, nvme: 'nenhum', hdd: 'hd2t' });
  assert.ok(!ids(hdd.errors).includes('no-storage'));
  assert.ok(ids(hdd.warnings).includes('hdd-only'));
});
test('Gen4 NVMe on H510 is described as a reduced link, not incompatible', () => {
  const result = analyzeBuild({ ...gaming, cpu: 'i5-10400f', motherboard: 'h510' });
  assert.ok(ids(result.warnings).includes('nvme-link'));
  assert.deepEqual(result.errors, []);
});
test('monitor context changes guidance without inventing a bottleneck percentage', () => {
  const high = analyzeBuild({ ...gaming, cpu: 'i5-10400f', motherboard: 'h510', resolution: '1080p', refresh: '240' });
  const low = analyzeBuild({ ...gaming, cpu: 'i5-10400f', motherboard: 'h510', resolution: '1080p', refresh: '60' });
  assert.ok(ids(high.warnings).includes('cpu-high-fps'));
  assert.ok(!ids(low.warnings).includes('cpu-high-fps'));
  assert.ok(ids(low.insights).includes('display-rate'));
  assert.ok(ids(analyzeBuild(gaming).warnings).includes('vram'));
  assert.ok(!/\d+\s*%/.test(JSON.stringify(high)));
});
test('saved values are allowlisted and free text is bounded', () => {
  const result = normalizeBuild({ cpu: 'fake', psu: 650, notes: 'x'.repeat(1000), games: 'y'.repeat(300), unexpected: true });
  assert.equal(result.cpu, ''); assert.equal(result.psu, '');
  assert.equal(result.notes.length, 600); assert.equal(result.games.length, 160);
  assert.ok(!('unexpected' in result));
  assert.deepEqual(normalizeBuild(null), EMPTY_BUILD);
});
test('WhatsApp round-trips accents, preferences, conflicts and the exact destination', () => {
  const input = { ...gaming, ram: 'd5-32', budget: '5000', style: 'discreto', games: 'Jogo & edição', notes: 'Já tenho SSD; prefiro silêncio + Wi-Fi.' };
  const url = new URL(whatsappUrl(input));
  assert.equal(url.hostname, 'wa.me'); assert.equal(url.pathname, '/5534992413197');
  assert.equal(url.searchParams.get('text'), buildMessage(input));
  assert.match(buildMessage(input), /DDR5 não serve/);
  assert.match(buildMessage(input), /Já tenho SSD; prefiro silêncio \+ Wi-Fi\./);
  assert.match(buildMessage(input), /3\.000 a R\$ 5\.000/);
});
