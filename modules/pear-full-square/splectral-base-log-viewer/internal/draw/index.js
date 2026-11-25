// draw: the log page as HTML, whole: the mrepo chosen, the filter, the
// records a table (README.md beside it).

export const STYLE = `
:root{--bg:#fff;--fg:#1d1f23;--muted:#5f6670;--line:#e3e6ea;--accent:#2457c5;--code:#f4f5f7;--bad:#c0392b}
@media (prefers-color-scheme:dark){:root{--bg:#16181c;--fg:#e6e8eb;--muted:#9aa2ad;--line:#2c3036;--accent:#7fa6ff;--code:#202329;--bad:#ff8a7a}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:64rem;margin:0 auto;padding:1.25rem 1rem 3rem}
.top{display:flex;flex-wrap:wrap;align-items:center;gap:.6rem;margin-bottom:1rem}
select,input{font:inherit;font-size:.9rem;padding:.2rem .4rem;border:1px solid var(--line);border-radius:4px;background:var(--bg);color:var(--fg)}
form.at{display:flex;gap:.4rem;flex:1;min-width:14rem}form.at input{flex:1;min-width:0;font-family:ui-monospace,monospace}
a{color:var(--accent);font-size:.9rem}
table{border-collapse:collapse;width:100%;font-size:.88rem;display:block;overflow-x:auto}
th,td{border-bottom:1px solid var(--line);padding:.3rem .5rem;text-align:left;vertical-align:top;white-space:nowrap}
th{color:var(--muted);font-weight:500}td.cmd{font-family:ui-monospace,monospace;white-space:normal;word-break:break-word;min-width:16rem}
td.ms{text-align:right;font-variant-numeric:tabular-nums}tr.failed td.cmd{color:var(--bad)}td.err{color:var(--bad);white-space:normal}
.error{border-left:3px solid var(--bad);padding:.4rem .8rem;background:var(--code)}
.none{color:var(--muted)}
footer{margin-top:2rem;color:var(--muted);font-size:.85rem;font-family:ui-monospace,monospace}
`

export const escape = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

// A choice made: its address opened at the top, relative to the page's
// base (its section), as a link is followed.
const GO = 'function go(s){if(s.value)top.location.href=new URL(s.value,document.baseURI).href}'

// input: { title, at, filter, mrepos: [{ label, value, selected }], refresh,
// records: [{ timestamp, from, command, ok, error, ms }], error, footer }
// -> HTML
export function draw (input) {
  if (!input || typeof input !== 'object') throw new Error('missing argument: page ({ title, records })')
  const records = Array.isArray(input.records) ? input.records : []
  const mrepos = Array.isArray(input.mrepos) && input.mrepos.length
    ? `<select aria-label="mrepo" onchange="go(this)">${input.mrepos.map(o => `<option value="${escape(o.value)}"${o.selected ? ' selected' : ''}>${escape(o.label)}</option>`).join('')}</select>`
    : ''
  // the filter on its records, changed by a plain form: the mrepo kept
  const at = `<form class="at" action="./"><input type="hidden" name="at" value="${escape(input.at ?? '')}"><input name="filter" value="${escape(input.filter ?? '')}" placeholder="[value/value/protocol='crud']" aria-label="a filter on the records, as written after done/*" autocomplete="off" spellcheck="false"></form>`
  const refresh = input.refresh ? `<a href="${escape(input.refresh)}">refresh</a>` : ''
  const error = input.error ? `<p class="error">${escape(input.error)}</p>` : ''
  const rows = records.map(r => `<tr${r.ok === false ? ' class="failed"' : ''}><td>${escape(String(r.timestamp ?? '').replace('T', ' ').replace(/Z$/, ''))}</td><td>${escape(r.from ?? '')}</td><td class="cmd">${escape(r.command ?? '')}${r.error ? `<div class="err">${escape(r.error)}</div>` : ''}</td><td class="ms">${r.ms === null || r.ms === undefined ? '' : escape(r.ms)}</td></tr>`).join('')
  const table = records.length
    ? `<table><thead><tr><th>completed</th><th>asked by</th><th>command</th><th>ms</th></tr></thead><tbody>${rows}</tbody></table>`
    : (input.error ? '' : '<p class="none">No records.</p>')
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(input.title ?? 'log')}</title><style>${STYLE}</style><script>${GO}</script></head><body><main><div class="top">${mrepos}${at}${refresh}</div>${error}${table}${input.footer ? `<footer>${escape(input.footer)}</footer>` : ''}</main></body></html>`
}
