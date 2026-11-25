// page: the log page: an mrepo's requests, its own request log read
// (`haicc <mrepo> crud/read "done/*" --flags layer=request`) and drawn:
// any mrepo of the install, chosen from its registry (README.md beside it).
import { draw } from '../draw/index.js'

// The mrepo read when none is asked for: the root.
export const DEFAULT = '.'
// An mrepo's position from the root: the root itself, or names.
const AT = /^(\.|[a-z][a-z0-9-]*(\/[a-z][a-z0-9-]*)*)$/
// A filter on the records: XPath filters, as written after `done/*`.
const FILTER = /^(\[[^\]]+\])+$/

// A request's record in request/done, a row: when it was completed, how
// long it took, who asked, the command, whether it failed and why.
// record: { offset, timestamp, value: { topic, timestamp, value: form } }
export function rowOf (record) {
  const core = record?.value
  const form = core?.value
  if (!form || typeof form !== 'object' || Array.isArray(form)) return null
  const ms = Date.parse(record.timestamp) - Date.parse(core.timestamp)
  const uri = Array.isArray(form.uri) ? form.uri.slice(1).join('/') : ''
  return {
    offset: record.offset,
    timestamp: record.timestamp ?? null,
    ms: Number.isFinite(ms) ? ms : null,
    from: core.topic ?? null,
    command: Array.isArray(form.command) ? form.command.join(' ') : [`${form.protocol}/${form.action}`, uri, ...(Array.isArray(form.args) ? form.args.map(String) : [])].filter(Boolean).join(' '),
    ok: !('error' in form),
    error: form.error ?? null
  }
}

// form: { query: { at, filter } }: the mrepo's position from the root, a
// filter on its records. Its links relative to its section: right
// wherever it is mounted.
export async function page (exec, { query = {} } = {}) {
  const at = query.at ? String(query.at) : DEFAULT
  if (!AT.test(at)) throw new Error(`not an mrepo's position: ${at}`)
  const filter = query.filter ? String(query.filter).trim() : ''
  if (filter && !FILTER.test(filter)) throw new Error(`not a filter: ${filter} (as after done/*: [value/value/protocol='crud'])`)
  const address = (a = at) => {
    const q = [...(a === DEFAULT ? [] : [`at=${encodeURIComponent(a)}`]), ...(filter ? [`filter=${encodeURIComponent(filter)}`] : [])]
    return `./${q.length ? `?${q.join('&')}` : ''}`
  }
  // the request log is the log: read where it is, a topic, the latest first
  const command = ['crud/read', `done/*${filter}`, '--flags', 'layer=request']
  let mrepos = []
  let records = []
  let error = null
  try {
    const [all, read] = await Promise.all([exec.data('.', ['haicc/mrepos']), exec.data(at, command)])
    mrepos = (all ?? []).filter(m => typeof m.position === 'string')
    records = (read ?? []).map(n => rowOf(n.value)).filter(Boolean)
  } catch (err) { error = err.message }
  exec.log('verbose', 'page', { at, filter, records: records.length, error })
  const known = mrepos.some(m => m.position === at)
  return draw({
    title: `log · ${at}`,
    at,
    filter,
    mrepos: [...(known || at === DEFAULT ? [] : [{ label: at, value: address(), selected: true }]), { label: '. (the root)', value: address(DEFAULT), selected: at === DEFAULT }, ...mrepos.filter(m => m.position !== DEFAULT).map(m => ({ label: `${m.position} (${m.uri})`, value: address(m.position), selected: m.position === at }))],
    refresh: address(),
    records,
    error,
    footer: `haicc ${at} ${command.map(p => (/[\s*'"[\]]/.test(p) ? JSON.stringify(p) : p)).join(' ')}`
  })
}
