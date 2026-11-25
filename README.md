# base-component-log-viewer

The log viewer, a Splectral component: one page showing the request log of any mrepo of the install.

A component is an app on Splectral: an mrepo Splectral deploys, this
package laid on top of it. Its page, served at its position, is the
mrepo's request log, drawn (`crud/read "done/*" --flags
layer=request`): `/log/` the root's requests in one table, the latest
first; `?at=<position>` another mrepo's, chosen from the install's;
`?filter=[...]` those a filter holds for.

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

Then `http://127.0.0.1:4400/log/`. It reads the root unless another mrepo is
chosen. Its service
stopped, its program ends and its pages are not answered; `haicc
splectral boot/teardown log` removes it.
