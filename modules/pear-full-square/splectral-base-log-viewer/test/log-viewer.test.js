import test from 'brittle'
import { draw, escape, page, rowOf, DEFAULT } from '../index.js'

// An execution as the page sees it: the commands it asks, each answered here.
const execution = answer => { const asked = []; return { asked, entries: [], log (level, event, data = {}) { this.entries.push({ level, event, ...data }) }, data: async (at, command) => { asked.push(`${at} ${command.join(' ')}`); return answer(at, command) } } }
const MREPOS = [{ uri: 'local/boot', position: '.', package: 'haiccing/base-component-boot', running: true }, { uri: 'local/host', position: 'host', package: 'haiccing/base-component-haicc', running: true }, { uri: 'local/lost', position: null, package: 'x', running: false }]
// a request's record in request/done: the record sent, completed
const done = (offset, form, ms = 12) => ({ topic: '/request/done', offset, timestamp: new Date(offset + ms).toISOString(), headers: {}, value: { topic: '/haicc/terminal', offset, timestamp: new Date(offset).toISOString(), value: form } })
const A = done(1795400000000, { protocol: 'rns', action: 'status', uri: ['main', '.'], output: {} })
const B = done(1795400000500, { protocol: 'crud', action: 'create', uri: ['main', 'notes/<x>'], args: ['{"a":1}'], error: 'x exists' }, 30)
const read = records => records.map(r => ({ uri: ['request', `done/*[@offset=${r.offset}]`], value: r }))

test('rowOf: a request\'s record a row: when it was completed, how long, who asked, its command, its error', (t) => {
  t.alike(rowOf(B), { offset: 1795400000500, timestamp: new Date(1795400000530).toISOString(), ms: 30, from: '/haicc/terminal', command: 'crud/create notes/<x> {"a":1}', ok: false, error: 'x exists' })
  t.alike([rowOf(A).command, rowOf(A).ok, rowOf(A).error], ['rns/status .', true, null], 'one that did not fail')
  t.is(rowOf(done(1, { command: ['crud/read', 'x'], output: [] })).command, 'crud/read x', 'a command as it was typed, where the record holds it')
  t.is(rowOf({ value: { value: 'text' } }), null, 'no request\'s record: none')
})

test('draw: a whole page: the mrepo chosen, the filter, the records a table, one that failed marked; everything escaped', (t) => {
  const html = draw({ title: 'log · host', at: 'host', filter: "[value/value/protocol='crud']", mrepos: [{ label: '. (the root)', value: './', selected: false }, { label: 'host (local/host)', value: './?at=host', selected: true }], refresh: './?at=host', records: [rowOf(B), rowOf(A)], footer: 'haicc host crud/read "done/*" --flags layer=request' })
  t.ok(html.startsWith('<!doctype html>'), 'a whole page')
  t.ok(html.includes('<title>log · host</title>'))
  t.ok(html.includes('<select aria-label="mrepo" onchange="go(this)"><option value="./">. (the root)</option><option value="./?at=host" selected>host (local/host)</option></select>'), 'the mrepo: a drop-down, the install\'s')
  t.ok(html.includes('<input type="hidden" name="at" value="host"><input name="filter" value="[value/value/protocol=\'crud\']"'), 'the filter on its records, in a plain form; the mrepo kept')
  t.ok(html.includes(`<tr class="failed"><td>${new Date(1795400000530).toISOString().replace('T', ' ').replace('Z', '')}</td><td>/haicc/terminal</td><td class="cmd">crud/create notes/&lt;x&gt; {&quot;a&quot;:1}<div class="err">x exists</div></td><td class="ms">30</td></tr>`), 'a record a row: when, who asked, its command, how long; one that failed with its error; escaped')
  t.ok(html.indexOf('crud/create') < html.indexOf('rns/status'), 'in the order given')
  t.ok(html.includes('prefers-color-scheme:dark'), 'its style with it, light and dark')
  t.absent(/<link\b/.test(html), 'nothing loaded from elsewhere')
  t.ok(draw({ title: 'x', records: [] }).includes('No records.'), 'no records: said')
  t.ok(draw({ title: 'x', records: [], error: 'not reachable' }).includes('<p class="error">not reachable</p>'), 'an error: said, in place of the table')
  t.is(escape('<a href="x">&'), '&lt;a href=&quot;x&quot;&gt;&amp;')
  t.exception(() => draw(), /missing argument: page/)
})

test('page: an mrepo\'s request log read and drawn: the root by default, the latest first as it is read; another mrepo; a filter', async (t) => {
  const all = execution((at, command) => (command[0] === 'haicc/mrepos' ? MREPOS : read([B, A])))
  const html = await page(all, { query: {} })
  t.alike(all.asked.sort(), ['. crud/read done/* --flags layer=request', '. haicc/mrepos'], 'asked of the root: its request layer\'s topic, read; the install\'s mrepos beside it')
  t.ok(html.indexOf('crud/create') < html.indexOf('rns/status'), 'in the order read: the latest first')
  t.ok(html.includes('<option value="./" selected>. (the root)</option><option value="./?at=host">host (local/host)</option></select>'), 'the mrepos of the install that have a position; one that has none left out')
  t.ok(html.includes('<footer>haicc . crud/read &quot;done/*&quot; --flags layer=request</footer>'), 'the command it is, below')
  const one = execution((at, command) => (command[0] === 'haicc/mrepos' ? MREPOS : read([B])))
  const filtered = await page(one, { query: { at: 'host', filter: "[value/value/protocol='crud']" } })
  t.ok(one.asked.includes("host crud/read done/*[value/value/protocol='crud'] --flags layer=request"), 'another mrepo, a filter: in the command, at the mrepo asked for')
  t.ok(filtered.includes('<option value="./?at=host&amp;filter=%5Bvalue%2Fvalue%2Fprotocol%3D\'crud\'%5D" selected>host (local/host)</option>'), 'its links keep the mrepo and the filter')
  t.absent(filtered.includes('rns/status'), 'the records the filter holds for only')
  const other = await page(execution((at, command) => (command[0] === 'haicc/mrepos' ? MREPOS : [])), { query: { at: 'host/swarms/s/node-1' } })
  t.ok(other.includes('<option value="./?at=host%2Fswarms%2Fs%2Fnode-1" selected>host/swarms/s/node-1</option>'), 'a position the registry does not say: shown as asked')
  const down = execution(() => { throw new Error('haicc host: no node there') })
  t.ok((await page(down, { query: { at: 'host' } })).includes('<p class="error">haicc host: no node there</p>'), 'an mrepo not there: its error on the page')
  await t.exception(page(all, { query: { at: '../x' } }), /not an mrepo's position/)
  await t.exception(page(all, { query: { filter: 'x' } }), /not a filter/)
  t.ok(all.entries.some(e => e.event === 'page'), 'what it did, logged')
  t.is(DEFAULT, '.')
})
