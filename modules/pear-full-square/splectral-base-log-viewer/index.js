// splectral-base-log-viewer: the log viewer, a Splectral component: one
// page that shows an mrepo's requests, its own request log, for any mrepo
// of the install (README.md beside each).
//   internal/   program: the component's program; render: its inbox
//               followed, its pages made; page: the log page, its data
//               the mrepo's request log, read; draw: the page as HTML
export { program } from './internal/program/index.js'
export { render } from './internal/render/index.js'
export { page, rowOf, DEFAULT } from './internal/page/index.js'
export { draw, escape, STYLE } from './internal/draw/index.js'
