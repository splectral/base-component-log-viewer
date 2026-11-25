# mrepo/

The component's part of the structure: its list of packages, and the runtime config laid on top of its mrepo.

- **Its packages** (`packages/.layer.json`): itself only, of the
  `splectral` organisation, placed on the mrepo's Splectral side, not in
  its `packages` layer.
- **Its runtime config**: its hooks, below, laid by the mrepo itself
  (`runtime/lay`).

## The base

What it is laid on top of, `haiccing/base-package-service`, brings
`boot` and `initialise`; this brings `start` and `stop` and replaces
nothing. No haiccing runtime loads its package.

## Runtime config

- `start`: its program started beside the mrepo, `runtime/start .
  splectral/packages/splectral/base-component-log-viewer`: from then on the component answers its pages.
- `stop`: its program ended, `runtime/stop` of the same.
