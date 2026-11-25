# logs

Shows an mrepo's requests in a browser: its own request log, for any mrepo of the install.

Splectral is deployed and in service, and a host is there. The viewer
is installed as any Splectral component, in two halves; its page is an
mrepo's request log read, `crud/read "done/*" --flags layer=request`.
The steps beside this page, `steps.haicc`, are the same commands with
what each answers.

## Steps

```sh
# the component: a plain service-managed mrepo, then the viewer on top
haicc splectral boot/deploy log haiccing/base-package-service
haicc splectral splectral/install log splectral/base-component-log-viewer
haicc splectral/log service/initialise
haicc splectral/log service/start
# what its page shows, as a command: the host's requests, the latest first
haicc host crud/read "done/*" --flags layer=request
# in a browser: the root; the host; those of one protocol
#   http://127.0.0.1:4400/log/
#   http://127.0.0.1:4400/log/?at=host
#   http://127.0.0.1:4400/log/?at=host&filter=[value/value/protocol='crud']
```

## Notes

- **The request log is the log**: nothing is copied or collected; the
  page reads each mrepo where it is, each time it is asked for.
- **Another mrepo**: the drop-down at the top of the page, the
  install's mrepos; or `?at=<its position from the root>`.
- **A filter**: the box at the top, as written after `done/*`; a bound
  on the offset is a time in milliseconds (`[@offset>1795400000000]`).
