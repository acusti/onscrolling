# Jank-free onscrolling&nbsp; [![build workflow](https://github.com/acusti/onscrolling/actions/workflows/deploy.yml/badge.svg)](https://github.com/acusti/onscrolling/actions)

A better, smoother, more performant onscroll event interface based on the concepts from [this html5rocks tutorial][html5rocks-tutorial]. It uses `requestAnimationFrame` plus debouncing for performance and mobile-compatibility (thanks to the `touchmove` event), giving you a fighting chance to achieve the hallowed 60fps of lore with your scroll-listening UI.

[![NPM](https://nodei.co/npm/onscrolling.png?compact=true)](https://nodei.co/npm/onscrolling/)

## Usage

The module is ESM-only and exports a single default `onscrolling` function:

### onscrolling( listener )

#### `listener` function `(payload: { scrollX: number; scrollY: number }) => void`

The function to call on a scroll event with a `{ scrollX: number; scrollY: number }` payload object. In this default version, the module will only invoke the listener when the page has been scrolled vertically.

### onscrolling( listener, options )

#### `listener` function `(payload: { scrollX: number; scrollY: number }) => void`

The function to call on a scroll event with a `{ scrollX: number; scrollY: number }` payload object. The listener is invoked when the page is scrolled in any of the direction specified in the `options` object (only once per event).

#### `options` object `{ horizontal?: boolean; vertical?: boolean; x?: boolean; y?: boolean }`

The scroll axis or axes to monitor. `x` is an alias for `horizontal`, and `y` is an alias for `vertical`. If neither horizontal nor vertical are true, `vertical` is used as the default. To listen for any scroll event in any direction, set both `horizontal` and `vertical` to `true`.

### onscrolling return value

#### `onscrolling` function `(listener: Listener, options?: Options) => () => void`

The `onscrolling` function returns a cleanup function that takes no arguments and is used to remove the passed-in scroll event `listener`.

## Dependencies

None.

## Compatibility

This module is ESM-only and takes advantage of modern JS language features. It includes code to ensure it won’t throw errors in non-browser environments (e.g. node, workersd, deno, bun, etc.), where it will not do anything but also won’t break SSR. To make it compatible with non-ESM environments and older browsers, it must be transpiled.

## Tests

Tests use vitest + happy-dom and can be run with `yarn test`.

## TODO

-   [ ] Add optional param to specify an object other than `window` to monitor for scroll events (e.g. `{ scrollingElement: DOMElement }`)
-   [ ] Expose `measure` and `mutate` functions to attach handlers specifically to the measuring (read) or mutating (write) portion of each cycle to minimize layout calculations

## Misc

_Note: This package was formerly known as [jank-free-onscroll][]_

[html5rocks-tutorial]: http://www.html5rocks.com/en/tutorials/speed/animations/#debouncing-scroll-events
[jank-free-onscroll]: https://github.com/acusti/jank-free-onscroll
