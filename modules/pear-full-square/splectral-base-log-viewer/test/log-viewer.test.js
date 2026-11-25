import test from 'brittle'
import { draw, escape, page, DEFAULT, LIMIT } from '../index.js'

// An execution as the page sees it: the commands it asks, each answered here.
const execution = answer => { const asked = []; return { asked, entries: [], log (level, event, data = {}) { this.entries.push({ level, event, ...data }) }, data: async (at, command) => { asked.push(`${at} ${command.join(' ')}`); return answer(at, command) } } }
const NODES = [{ uri: 'swarm-1/master', length: 4 }, { uri: 'swarm-1/node-1', length: 2 }]
const RECORDS = [
  { node: 'swarm-1/master', offset: 3, timestamp: '2026-11-21T00:00:01.000Z', request: 'k1', command: 'rns/status', ok: true, error: null, ms: 12 },
  { node: 'swarm-1/node-1', offset: 1, timestamp: '2026-11-21T00:00:02.000Z', request: 'k2', command: 'crud/create <x>', ok: false, error: 'x exists', ms: 30 }
]

test('draw: a whole page: the node filter, the master\'s position, the records a table, one that failed marked; everything escaped', (t) => {
  const html = draw({ title: 'log · swarm-1/node-1', at: DEFAULT, filter: [{ label: 'every node (2)', value: './', selected: false }, { label: 'swarm-1/node-1 (2)', value: './?node=swarm-1%2Fnode-1', selected: true }], refresh: './?node=swarm-1%2Fnode-1', records: [...RECORDS].reverse(), footer: 'haicc x log/read . 100' })
  t.ok(html.startsWith('<!doctype html>'), 'a whole page')
  t.ok(html.includes('<title>log · swarm-1/node-1</title>'))
  t.ok(html.includes('<select aria-label="node" onchange="go(this)"><option value="./">every node (2)</option><option value="./?node=swarm-1%2Fnode-1" selected>swarm-1/node-1 (2)</option></select>'), 'the filter: a drop-down, every node and each one')
  t.ok(html.includes(`<input name="at" value="${DEFAULT}"`), 'the master read: its position, in a plain form')
  t.ok(html.includes('<tr class="failed"><td>2026-11-21 00:00:02.000</td><td>swarm-1/node-1</td><td class="cmd">crud/create &lt;x&gt;<div class="err">x exists</div></td><td class="ms">30</td></tr>'), 'a record a row: when, its node, its command, how long; one that failed with its error; escaped')
  t.ok(html.indexOf('crud/create') < html.indexOf('rns/status'), 'in the order given')
  t.ok(html.includes('prefers-color-scheme:dark'), 'its style with it, light and dark')
  t.absent(/<link\b/.test(html), 'nothing loaded from elsewhere')
  t.ok(draw({ title: 'x', records: [] }).includes('No records.'), 'no records: said')
  t.ok(draw({ title: 'x', records: [], error: 'not reachable' }).includes('<p class="error">not reachable</p>'), 'an error: said, in place of the table')
  t.is(escape('<a href="x">&'), '&lt;a href=&quot;x&quot;&gt;&amp;')
  t.exception(() => draw(), /missing argument: page/)
})

test('page: the master\'s log/read drawn: every node by default, the newest first; filtered by node; another master; a limit', async (t) => {
  const all = execution(() => ({ nodes: NODES, records: RECORDS }))
  const html = await page(all, { query: {} })
  t.alike(all.asked, [`${DEFAULT} log/read . ${LIMIT}`], 'asked of the default master: log/read, the limit')
  t.ok(html.indexOf('crud/create') < html.indexOf('rns/status'), 'the newest first')
  t.ok(html.includes('<option value="./" selected>every node (2)</option><option value="./?node=swarm-1%2Fmaster">swarm-1/master (4)</option><option value="./?node=swarm-1%2Fnode-1">swarm-1/node-1 (2)</option>'), 'the filter: the nodes whose logs the master holds')
  t.ok(html.includes(`<footer>haicc ${DEFAULT} log/read . 100</footer>`), 'the command it is, below')
  const one = execution((at, command) => (command.length === 3 ? { nodes: NODES, records: [] } : { nodes: [NODES[1]], records: [RECORDS[1]] }))
  const filtered = await page(one, { query: { node: 'swarm-1/node-1', at: 'h/swarms/s2/master', limit: '5' } })
  t.alike(one.asked.sort(), ['h/swarms/s2/master log/read . 1', 'h/swarms/s2/master log/read . swarm-1/node-1 5'], 'filtered: the node and the limit in the command, at the master asked for; the nodes asked beside it')
  t.ok(filtered.includes('<option value="./?at=h%2Fswarms%2Fs2%2Fmaster&amp;node=swarm-1%2Fnode-1&amp;limit=5" selected>swarm-1/node-1 (2)</option>'), 'its links keep the master, the node and the limit')
  t.absent(filtered.includes('rns/status'), 'one node\'s records only')
  const down = execution(() => { throw new Error('haicc host/swarms/swarm-1/master: no node there') })
  t.ok((await page(down, { query: {} })).includes('<p class="error">haicc host/swarms/swarm-1/master: no node there</p>'), 'the master not there: its error on the page')
  await t.exception(page(all, { query: { at: '../x' } }), /not an mrepo's position/)
  await t.exception(page(all, { query: { node: 'x y' } }), /not a node's unique URI/)
  await t.exception(page(all, { query: { limit: '0' } }), /not a limit/)
  t.ok(all.entries.some(e => e.event === 'page'), 'what it did, logged')
})
