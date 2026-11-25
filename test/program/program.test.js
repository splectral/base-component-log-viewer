// The package's program, run.js, as its start hook starts it
// (runtime/start: --dir, --runtime, --state), against the component's
// Splectral side made here, its record. A page asked through its inbox,
// its data (the mrepo's request log, read) answered as the server answers it,
// the page read from its outbox; then ended with its runtime. No mrepo is built.
import test from '../../modules/node_modules/brittle/index.js'
import os from '../../modules/node_modules/bare-os/index.js'
import { spawn } from '../../modules/node_modules/bare-subprocess/index.js'
import { mkdtempSync, mkdirSync, writeFileSync, renameSync, readFileSync, readdirSync, rmSync, existsSync } from '../../modules/node_modules/bare-fs/index.js'
import { join, dirname } from '../../modules/node_modules/bare-path/index.js'
import { fileURLToPath } from '../../modules/node_modules/bare-url/index.js'

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const wait = ms => new Promise(resolve => setTimeout(resolve, ms))
const until = async (ok, ms = 10000) => { for (let i = 0; i < ms / 50; i++) { if (await ok()) return true; await wait(50) } return false }
// catch: no such process: not alive
const alive = pid => { try { os.kill(pid, 0); return true } catch { return false } }
const put = (folder, key, value) => { writeFileSync(join(folder, `${key}.json.new`), JSON.stringify(value)); renameSync(join(folder, `${key}.json.new`), join(folder, `${key}.json`)) }
const envelope = (key, form) => ({ topic: '/local/log/splectral/inbox', key, timestamp: new Date().toISOString(), headers: {}, value: { topic: '/splectral', key, timestamp: new Date().toISOString(), headers: {}, value: form } })

test('the program: its page made over its Splectral boxes; its state; ended with its runtime', { timeout: 60000 }, async (t) => {
  const dir = mkdtempSync(join(os.tmpdir(), 'log-viewer-program-'))
  const side = join(dir, 'splectral')
  mkdirSync(join(side, 'inbox'), { recursive: true })
  mkdirSync(join(side, 'outbox'), { recursive: true })
  writeFileSync(join(side, 'component.json'), JSON.stringify({ at: 'log', mrepo: 'local/log', component: 'splectral/base-component-log-viewer', list: ['splectral/base-component-log-viewer'] }))
  const state = join(dir, 'log-viewer.state.json')
  const runtime = spawn(Bare.argv[0], ['-e', 'setInterval(() => {}, 1000)'], { stdio: 'ignore' })
  const p = spawn(Bare.argv[0], [join(pkg, 'run.js'), `--dir=${dir}`, `--runtime=${runtime.pid}`, `--state=${state}`], { stdio: 'ignore' })
  try {
    t.ok(await until(() => existsSync(state)), 'its state written once it follows its inbox')
    t.is(JSON.parse(readFileSync(state, 'utf8')).component, 'splectral/base-component-log-viewer', 'the component it runs for')
    const key = '11111111-1111-4111-8111-111111111111'
    put(join(side, 'inbox'), key, envelope(key, { request: 'page', path: '', query: { at: 'host' } }))
    // the server, as far as the test goes: what the page asks for in the outbox, answered in the inbox
    const asked = []
    const DONE = { topic: '/request/done', offset: 1795400000000, timestamp: '2026-11-22T21:33:20.007Z', value: { topic: '/haicc/terminal', offset: 1795400000000, timestamp: '2026-11-22T21:33:20.000Z', value: { protocol: 'crud', action: 'read', uri: ['main', '.'], output: [] } } }
    const answer = () => {
      for (const name of readdirSync(join(side, 'outbox'))) {
        const r = JSON.parse(readFileSync(join(side, 'outbox', name), 'utf8'))
        const form = r.value.value
        if (form.request === 'page') continue
        rmSync(join(side, 'outbox', name))
        asked.push(form)
        const output = form.command[0] === 'haicc/mrepos' ? [{ uri: 'local/host', position: 'host', package: 'haiccing/base-component-haicc', running: true }] : [{ uri: ['request', 'done/*[@offset=1795400000000]'], value: DONE }]
        put(join(side, 'inbox'), r.key, envelope(r.key, { ...form, output }))
      }
      return asked.length >= 2
    }
    t.ok(await until(answer), 'its data asked in its outbox')
    t.alike(asked.map(f => [f.request, f.at, ...f.command].join(' ')).sort(), ['data . haicc/mrepos', 'data host crud/read done/* --flags layer=request'], 'the mrepo\'s request log, a command at its position; the install\'s mrepos beside it')
    t.ok(await until(() => existsSync(join(side, 'outbox', `${key}.json`))), 'the page answered')
    const html = JSON.parse(readFileSync(join(side, 'outbox', `${key}.json`), 'utf8')).value.value.output
    t.ok(html.includes('<td>/haicc/terminal</td><td class="cmd">crud/read .</td><td class="ms">7</td>'), 'the records drawn')
    t.ok(html.includes('<footer>haicc host crud/read &quot;done/*&quot; --flags layer=request</footer>'), 'with the command it shows')
    runtime.kill()
    t.ok(await until(() => !alive(p.pid)), 'ended with its runtime')
    t.absent(existsSync(state), 'its state removed')
  } finally {
    // catch: ended already: nothing to signal
    try { runtime.kill() } catch {}
    // catch: ended already: nothing to signal
    try { os.kill(p.pid, 'SIGKILL') } catch {}
    rmSync(dir, { recursive: true, force: true })
  }
})
