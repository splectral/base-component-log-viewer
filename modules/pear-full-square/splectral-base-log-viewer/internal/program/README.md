# program

Runs the log viewer as a program: what its start hook starts, until it is ended.

## Signature

`program(argv)`: `--dir=<the mrepo's folder> --runtime=<pid>
--state=<file>`, what `runtime/start` hands it.

## Returns

Nothing: it writes its state, `{ pid, component, started }`, once it is
up, and ends on `SIGTERM`, with its runtime, or when the folder is gone.

## Errors

- No component installed in the folder: `no component here`.
