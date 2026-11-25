# page

Makes the log page: the master's log/read asked and drawn, every node's records or one node's.

## Signature

`page(exec, { query })`: `query` is `{ at, node, limit }`: the master's
position from the root, a node's unique URI to filter by, how many
records. `exec.data(at, command)` answers a command at an mrepo.

## Returns

The page's HTML: the node filter, the records the newest first, the
command it is below. What the master refuses is said on the page.

## Errors

- `not an mrepo's position`, `not a node's unique URI`, `not a limit`
  (1 to 10000).

## Also exported

- `DEFAULT`: `host/swarms/swarm-1/master`, the master read when none is
  asked for; `LIMIT`: 100.
