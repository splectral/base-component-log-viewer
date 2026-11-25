# splectral-base-log-viewer

The log viewer, a Splectral component: one page showing the request log of any mrepo of the install.

The request log is the log: the page is `crud/read "done/*" --flags
layer=request` at the mrepo chosen, drawn: its requests in one table,
the latest first; a drop-down chooses the mrepo, from the install's
registry (`haicc/mrepos`); a box filters the records. The component
asks the platform for its data, as a terminal runs a command, each time
the page is asked for. Carried by `splectral/base-component-log-viewer`.

## Links

- [internal](internal/)
- [test](test/)

## Addresses

Below the position it is installed at, `log`:

| address | shows |
|---|---|
| `/log/` | the root's requests, every one, the latest first |
| `/log/?at=host` | another mrepo's, by its position from the root |
| `/log/?at=host&filter=[value/value/protocol='crud']` | those a filter holds for, as written after `done/*` |

## Design

- **On the help viewer's pattern**: a standalone component, its program
  following its Splectral inbox, each page made and answered; what the
  two share is not factored out yet.
- **No log of its own**: an mrepo's requests are in its request layer
  (`request/done`), a topic; nothing is copied, summarised or collected.
- **Nothing kept**: a log moves, so every page reads the mrepo again.
- **Direct commands, the same install**: each mrepo read where it is;
  its data replicated into the viewer's own mrepo is the next stage.
- **Every record of the topic**: a query says where, never how many; a
  bound on the offset narrows it (`[@offset>N]`, a time in
  milliseconds).

## Tests

- `brittle-bare test/*.test.js` (Bare installed): each test by its name in [test/](test/).
