# render

Follows the component's Splectral inbox, makes each page asked for and asks the platform for its data.

## Signature

`render({ side, installed, timeout, every })`: `side` the component's
Splectral side of its mrepo's folder, `installed` its record there.

## Returns

`{ stop(), entries() }`: ended; what its pages logged.

## Design

A page request in the inbox is answered in the outbox with its HTML, or
its error. The page's data is a `data` request to the server, a command
at an mrepo, its completed form back in the inbox; asked each time,
nothing kept.
