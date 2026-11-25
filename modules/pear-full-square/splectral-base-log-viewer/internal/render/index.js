// render: the component's Splectral inbox followed, each page made, the
// data it needs asked of the platform (README.md beside it).
import { rmSync } from 'bare-fs'
import { join } from 'bare-path'
import { record, guid, queueOf, keyed } from 'mrepo-base-request'
import { follow, TOPIC, SIDE } from 'splectral-server'
import { page } from '../page/index.js'

const completed = form => form && typeof form === 'object' && ('output' in form || 'error' in form)

// side: the component's Splectral side; installed: its record
// (component.json, splectral/install's). -> { stop, entries }
export function render ({ side, installed, timeout = 120, every = 2000 }) {
  const pending = new Map()
  const entries = []
  // (into the outbox, to the server: the core's topic where its answer goes)
  const out = (key, form, topic) => queueOf(join(side, 'outbox')).write(key, keyed(TOPIC, record(topic, form), key))
  // A request to the server, its completed form back in the inbox.
  const asked = (form, what) => {
    const key = guid()
    const answered = new Promise((resolve, reject) => {
      const t = setTimeout(() => { pending.delete(key); reject(new Error(`no answer in ${timeout} s: ${what}`)) }, timeout * 1000)
      pending.set(key, done => { clearTimeout(t); pending.delete(key); resolve(done) })
    })
    out(key, form, `/${installed.mrepo}/${SIDE}/inbox`)
    return answered
  }
  // An execution as the page sees it: a command's answer asked of the
  // platform, each time (a log moves: nothing is kept), and its log.
  const execution = () => ({
    log: (level, event, data = {}) => entries.push({ level, event, time: new Date().toISOString(), ...data }),
    async data (at, command) {
      const done = await asked({ request: 'data', at, command }, `${at} ${command.join(' ')}`)
      if ('error' in done) throw new Error(done.error)
      return done.output
    }
  })
  const following = follow(join(side, 'inbox'), (envelope, file) => {
    rmSync(join(side, 'inbox', file), { force: true })
    const form = envelope?.value?.value
    if (form?.request === 'data' && completed(form)) return pending.get(envelope.key)?.(form)
    if (form?.request !== 'page' || completed(form)) return
    const exec = execution()
    const started = Date.now()
    Promise.resolve()
      .then(() => page(exec, { uri: form.path ?? '', query: form.query ?? {} }))
      .then(output => ({ output: String(output ?? '') }), err => ({ error: err.message }))
      .then(done => {
        exec.log('info', 'page', { path: form.path ?? '', ms: Date.now() - started, ok: !('error' in done) })
        out(envelope.key, { ...form, ...done }, envelope.value.topic)
      })
  }, { every })
  return { stop: () => following.stop(), entries: () => [...entries] }
}
