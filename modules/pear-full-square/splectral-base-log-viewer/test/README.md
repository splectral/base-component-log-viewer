# test/

The tests of splectral-base-log-viewer, a section per file, each test by its name.

`program.js` is the viewer as a program, for a test that starts it.

## `log-viewer.test.js`

- rowOf: a request's record a row: when it was completed, how long, who asked, its command, its error
- draw: a whole page: the mrepo chosen, the filter, the records a table, one that failed marked; everything escaped
- page: an mrepo's request log read and drawn: the root by default, the latest first as it is read; another mrepo; a filter
