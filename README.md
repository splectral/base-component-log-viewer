# base-component-log-viewer

The log viewer, a Splectral component: one page showing a swarm's logs as its master holds them, filtered by node.

A component is an app on Splectral: an mrepo Splectral deploys, this
package laid on top of it. Its page, served at its position, is the
master's `log/read`, drawn: `/log/` every node's records in one table,
the newest first; `?node=swarm-1/node-2` one node's; `?at=<position>`
another swarm's master; `?limit=500` more records.

On the help viewer's pattern: one package, its program and its page in
it.

## Links

- [mrepo](mrepo/)
- [howto](howto/)
- [test](test/)
- [test-reports](test-reports/)
- [modules](modules/)

## Installing

```sh
haicc splectral boot/deploy log haiccing/base-package-service
haicc splectral splectral/install log splectral/base-component-log-viewer
haicc splectral/log service/initialise
haicc splectral/log service/start
```

Then `http://127.0.0.1:4400/log/`. It reads the master at
`host/swarms/swarm-1/master` unless another is named. Its service
stopped, its program ends and its pages are not answered; `haicc
splectral boot/teardown log` removes it.
