# test/configured/

The component's own test: its list and its hooks, without an mrepo, then its bundle.

## What it checks

- **Its list**: itself only, of its own organisation.
- **Its hooks, file by file**: `start` and `stop`, its program started
  and ended where `splectral/install` places it; no other runtime
  config. A hook file not named in the test fails it.
- **Its bundle**, read from the sources: a program (its `/run` entry),
  no protocol.

## Sources

`SOURCES`: the sources folder, with its bundle. Without it the test
fails.

## Not here

The component installed on a running Splectral, its program started by
its hook, a page served: the `haicc` command's end to end test,
`splectral.sh`.
