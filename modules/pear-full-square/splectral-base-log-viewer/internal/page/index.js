// page: the log page: a swarm's logs as its master holds them, `haicc
// <master> log/read . [<node>] <limit>` drawn: every node's in one view,
// or one node's (README.md beside it).
import { draw } from '../draw/index.js'

// The master read when none is asked for: the first swarm's of a host.
export const DEFAULT = 'host/swarms/swarm-1/master'
// The records shown when no number is asked for.
export const LIMIT = 100
// A position from the root: names.
const AT = /^[a-z][a-z0-9-]*(\/[a-z][a-z0-9-]*)*$/
// A node's unique URI.
const NODE = /^[a-z][a-z0-9-]*(\/[a-z][a-z0-9-]*)+$/

// form: { query: { at, node, limit } }: the master's position from the
// root, a node to filter by, how many records. Its links relative to its
// section: right wherever it is mounted.
export async function page (exec, { query = {} } = {}) {
  const at = query.at ?? DEFAULT
  if (!AT.test(at)) throw new Error(`not an mrepo's position: ${at}`)
  const node = query.node ? String(query.node) : null
  if (node !== null && !NODE.test(node)) throw new Error(`not a node's unique URI: ${node}`)
  const limit = query.limit === undefined ? LIMIT : Number(query.limit)
  if (!Number.isInteger(limit) || limit < 1 || limit > 10000) throw new Error(`not a limit: ${query.limit} (1 to 10000 records)`)
  // an address: the master when not the default, the node, the limit
  const address = ({ n = node, l = limit } = {}) => {
    const q = [...(at === DEFAULT ? [] : [`at=${encodeURIComponent(at)}`]), ...(n ? [`node=${encodeURIComponent(n)}`] : []), ...(l === LIMIT ? [] : [`limit=${l}`])]
    return `./${q.length ? `?${q.join('&')}` : ''}`
  }
  const command = ['log/read', '.', ...(node ? [node] : []), String(limit)]
  // the nodes whose logs the master holds: asked without a filter, so the
  // drop-down names every one
  let nodes = []
  let records = []
  let error = null
  try {
    const [all, shown] = await Promise.all([node ? exec.data(at, ['log/read', '.', '1']) : null, exec.data(at, command)])
    nodes = (all ?? shown).nodes ?? []
    records = shown.records ?? []
  } catch (err) { error = err.message }
  exec.log('verbose', 'page', { at, node, limit, records: records.length, error })
  return draw({
    title: `log · ${node ?? at}`,
    at,
    filter: [{ label: `every node (${nodes.length})`, value: address({ n: null }), selected: node === null }, ...nodes.map(n => ({ label: `${n.uri} (${n.length})`, value: address({ n: n.uri }), selected: n.uri === node }))],
    refresh: address(),
    // the newest first: what one looks for
    records: [...records].reverse(),
    error,
    footer: `haicc ${at} ${command.join(' ')}`
  })
}
