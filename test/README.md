# test/

The log viewer's tests: two of its own, `configured` and `program`, and the generic ones, a folder each.

## Links

- [configured](configured/)
- [program](program/)
- [info](info/)
- [code](code/)
- [mrepo](mrepo/)
- [package](package/)
- [modules](modules/)
- [info-in-situ](info-in-situ/)
- [mrepo-in-situ](mrepo-in-situ/)

## Sets

| set | tests |
|---|---|
| `validate` | `configured`, `program`, `info`, `code`, `mrepo`, `package` |
| `validate-in-situ` | `info-in-situ`, `mrepo-in-situ`: for a package run in an mrepo; a Splectral package runs on its component's Splectral side, where these do not apply |
| `full` | `configured`, `program`, `info`, `code`, `mrepo`, `package`, `modules` |
