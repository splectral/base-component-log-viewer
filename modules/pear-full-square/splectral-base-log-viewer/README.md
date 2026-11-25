# splectral-base-log-viewer

The log viewer, a Splectral component: one page showing a swarm's logs as its master holds them, filtered by node.

The page is the master's `log/read`, drawn: every node's records in one
table, the newest first; a drop-down filters by node; a box names the
master read, by its position from the root. The component asks the
platform for its data, as a terminal runs a command, each time the page
is asked for. Carried by `splectral/base-component-log-viewer`.

## Links

- [internal](internal/)
- [test](test/)

## Addresses

Below the position it is installed at, `log`:

| address | shows |
|---|---|
| `/log/` | the default master's logs, `host/swarms/swarm-1/master`, every node, the last 100 records |
| `/log/?node=swarm-1/node-2` | one node's |
| `/log/?at=host/swarms/swarm-2/master` | another swarm's master |
| `/log/?limit=500` | more records |

## Design

- **On the help viewer's pattern**: a standalone component, its program
  following its Splectral inbox, each page made and answered; what the
  two share is not factored out yet.
- **Nothing kept**: a log moves, so every page asks the master again.
- **The master is named, not found**: the platform does not know a
  swarm's nodes; the page takes the master's position.

## Tests

- `brittle-bare test/*.test.js` (Bare installed): each test by its name in [test/](test/).
