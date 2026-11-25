# test/program/

The package's own test: its program, `run.js`, as its start hook starts it.

## What it checks

- **Started as `runtime/start` starts it** (`--dir`, `--runtime`,
  `--state`), against the component's Splectral side made in a temporary
  folder, its record.
- **Its state**, written once it follows its inbox: the component.
- **A page made over the boxes**: asked in its inbox for one mrepo, its
  data asked in its outbox (the mrepo's request log, `crud/read` at its
  position; the install's mrepos beside it) and answered as the server
  answers it, the records drawn in its outbox, with the command it
  shows.
- **Ended with its runtime**, its state removed.

## Not here

The component installed on a running Splectral, its program started by
its hook: the `haicc` command's end to end test, `splectral.sh`.
