// program: the log viewer's program: what its start hook starts
// (runtime/start), until it is ended (README.md beside it).
import process from 'bare-process'
import os from 'bare-os'
import { existsSync, readFileSync, writeFileSync, renameSync, rmSync } from 'bare-fs'
import { join } from 'bare-path'
import { SIDE } from 'splectral-server'
import { render } from '../render/index.js'

// catch: no such process: not alive
const alive = pid => { try { os.kill(pid, 0); return true } catch { return false } }

//   --dir=<the mrepo's folder>   its Splectral side in it
//   --runtime=<pid>              the mrepo's runtime: ended with it
//   --state=<file>               where its state is written once it is up
export async function program (argv) {
  const arg = name => argv.find(a => a.startsWith(`--${name}=`))?.slice(name.length + 3)
  const dir = arg('dir')
  const state = arg('state')
  if (!dir || !state) throw new Error('--dir=<the mrepo\'s folder> --state=<file> [--runtime=<pid>]')
  const runtime = arg('runtime') ? Number(arg('runtime')) : null
  const side = join(dir, SIDE)
  const file = join(side, 'component.json')
  if (!existsSync(file)) throw new Error(`no component here: ${side} (splectral/install first)`)
  const installed = JSON.parse(readFileSync(file, 'utf8'))
  const r = render({ side, installed })
  writeFileSync(`${state}.new`, JSON.stringify({ pid: process.pid, component: installed.component, started: new Date().toISOString() }) + '\n')
  renameSync(`${state}.new`, state)
  await new Promise(resolve => {
    let done = false
    const end = () => { if (done) return; done = true; clearInterval(t); r.stop(); rmSync(state, { force: true }); resolve() }
    process.on('SIGTERM', end)
    process.on('SIGINT', end)
    // ended with its mrepo: the folder gone, or its runtime
    const t = setInterval(() => { if (!existsSync(dir) || (runtime && !alive(runtime))) end() }, 250)
  })
}
