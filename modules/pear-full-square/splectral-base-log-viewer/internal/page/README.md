# page

Makes the log page: an mrepo's request log read and drawn, for any mrepo of the install.

## Signature

`page(exec, { query })`: `query` is `{ at, filter }`: the mrepo's
position from the root (`.` the root, when none), a filter on its
records as written after `done/*`. `exec.data(at, command)` answers a
command at an mrepo.

## Returns

The page's HTML: the mrepo chosen among the install's (`haicc/mrepos`,
those with a position), the filter, the records the latest first as the
topic is read, the command it is below. What the mrepo refuses is said
on the page.

## Errors

- `not an mrepo's position`, `not a filter`.

## Also exported

- `rowOf(record)`: a request's record in `request/done` as a row:
  `{ offset, timestamp, ms, from, command, ok, error }`: when it was
  completed, how long it took, who asked (the topic its answer went
  to), its command, whether it failed and why; `null` for what is no
  request's record.
- `DEFAULT`: `.`, the mrepo read when none is asked for.
