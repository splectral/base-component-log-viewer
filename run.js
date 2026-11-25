// The log viewer's program, this process: each page the Splectral server
// asks for made, until it is ended (SIGTERM, SIGINT), its mrepo's folder
// is gone or its mrepo's runtime has ended. Started by the component's
// start hook:
//   runtime/start . splectral/packages/splectral/base-component-log-viewer
//   (bare <bundle> --dir=<the mrepo's folder> --runtime=<pid> --state=<file>)
import process from './modules/node_modules/bare-process/index.js'
import { program } from './modules/pear-full-square/splectral-base-log-viewer/index.js'

await program(process.argv.slice(2))
process.exit(0) // ended: here (its signal handlers would hold the process open)
