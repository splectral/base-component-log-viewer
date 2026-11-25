// The component as it is configured: its list of packages and its hooks,
// value by value; then its bundle, read from the sources (SOURCES): the
// program its hooks start, no protocol. No mrepo is built. Every hook
// file the component brings must be named here.
import test from '../../modules/node_modules/brittle/index.js'
import { readFileSync, readdirSync, existsSync } from '../../modules/node_modules/bare-fs/index.js'
import { join, dirname } from '../../modules/node_modules/bare-path/index.js'
import { fileURLToPath, pathToFileURL } from '../../modules/node_modules/bare-url/index.js'
import os from '../../modules/node_modules/bare-os/index.js'

const pkg = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const json = (...p) => JSON.parse(readFileSync(join(pkg, ...p), 'utf8'))
const hooksDir = join(pkg, 'mrepo', 'runtime', 'hooks')
const brought = {}
for (const f of existsSync(hooksDir) ? readdirSync(hooksDir).sort() : []) readFileSync(join(hooksDir, f), 'utf8').split('\n').map(l => l.trim()).filter(l => l && !l.startsWith('#')).forEach((l, i) => { brought[`${f.replace(/\.haicc$/, '')}/${i + 1}`] = l.split(/\s+/) })

const LIST = ['splectral/base-component-log-viewer']
const PROGRAM = 'splectral/packages/splectral/base-component-log-viewer'

test('its list of packages: itself only, of its own organisation', (t) => {
  t.alike(json('mrepo', 'packages', '.layer.json').packages, LIST, 'the component alone: its program and its page in it')
  t.ok(LIST.every(p => p.startsWith('splectral/')), 'none of another organisation: no haiccing package')
})

test('its hooks, file by file: start and stop, its program; no other runtime config', (t) => {
  t.alike(brought, {
    'start/1': ['runtime/start', '.', PROGRAM],
    'stop/1': ['runtime/stop', '.', PROGRAM]
  }, 'each hook file, its transition and its command; none that is not named here')
  t.alike(readdirSync(join(pkg, 'mrepo', 'runtime')).sort(), ['hooks'], 'no service state, no boot hook: the base\'s, it replaces none')
  t.is(PROGRAM, `splectral/packages/${LIST[0]}`, 'its program where splectral/install places it: the first of its list, as the server looks for its state')
})

// Its bundle, from the sources: a program, no protocol.
const sources = os.getEnv('SOURCES')
let entries = null
if (sources && existsSync(join(sources, `${LIST[0]}.bundle`))) entries = await (await import(pathToFileURL(join(sources, `${LIST[0]}.bundle`)).href)).run('/', { dryRun: true })

test('its bundle in the sources: a program, its /run entry; no protocol', (t) => {
  t.ok(sources, 'SOURCES: the sources folder, its bundle in it')
  t.ok(entries, 'its bundle there')
  t.ok(entries?.includes('/run'), 'a program: what its start hook starts')
  t.absent(entries?.includes('/protocol'), 'no protocol: nothing of it is loaded by name')
})
