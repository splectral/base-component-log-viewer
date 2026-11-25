// The log viewer as a program, for the tests: as the package's run.js starts it.
import process from 'bare-process'
import { program } from '../index.js'

await program(process.argv.slice(2))
process.exit(0)
