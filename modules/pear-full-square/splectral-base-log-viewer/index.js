// splectral-base-log-viewer: the log viewer, a Splectral component: one
// page that shows a swarm's logs as its master holds them (README.md
// beside each).
//   internal/   program: the component's program; render: its inbox
//               followed, its pages made; page: the log page, its data
//               asked of the master; draw: the page as HTML
export { program } from './internal/program/index.js'
export { render } from './internal/render/index.js'
export { page, DEFAULT, LIMIT } from './internal/page/index.js'
export { draw, escape, STYLE } from './internal/draw/index.js'
