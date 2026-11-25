# draw

Draws the log page as HTML, whole: the node filter, the master's position, the records a table.

## Signature

`draw(input)`: `{ title, at, filter: [{ label, value, selected }],
refresh, records: [{ node, timestamp, command, ok, error, ms }], error,
footer }`.

## Returns

One HTML page, its style in it, light and dark; nothing loaded from
elsewhere; every value escaped. A record that failed is marked, its
error below its command.

## Errors

- No input: `missing argument: page`.

## Also exported

- `escape(text)`: a text made safe in HTML; `STYLE`: the page's style.
