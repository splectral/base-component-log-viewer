# draw

Draws the log page as HTML, whole: the mrepo chosen, the filter, the records a table.

## Signature

`draw(input)`: `{ title, at, filter, mrepos: [{ label, value, selected
}], refresh, records: [{ timestamp, from, command, ok, error, ms }],
error, footer }`.

## Returns

One HTML page, its style in it, light and dark; nothing loaded from
elsewhere; every value escaped. A record that failed is marked, its
error below its command.

## Errors

- No input: `missing argument: page`.

## Also exported

- `escape(text)`: a text made safe in HTML; `STYLE`: the page's style.
