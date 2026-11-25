# logs

Shows a swarm's logs in a browser: every node's records as the master holds them, filtered by node.

A swarm is there with its master and its nodes (the swarm package's
how-to `swarm`), and Splectral is deployed and in service. The viewer
is installed as any Splectral component, in two halves; its page is the
master's `log/read`. The steps beside this page, `steps.haicc`, are the
same commands with what each answers.

## Steps

```sh
# the component: a plain service-managed mrepo, then the viewer on top
haicc splectral boot/deploy log haiccing/base-package-service
haicc splectral splectral/install log splectral/base-component-log-viewer
haicc splectral/log service/initialise
haicc splectral/log service/start
# what its page shows, as a command: every node's log, at the master
haicc host/swarms/swarm-1/master log/read
# in a browser: every node; one node; more records
#   http://127.0.0.1:4400/log/
#   http://127.0.0.1:4400/log/?node=swarm-1/node-1
#   http://127.0.0.1:4400/log/?limit=500
```

## Notes

- **Lazily**: a node's records reach the master some seconds after they
  are made; `haicc <node> log/status . sync` brings them there now.
- **Another swarm**: `?at=<its master's position from the root>`, or the
  box at the top of the page.
