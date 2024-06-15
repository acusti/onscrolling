# Jank-free onscrolling&nbsp; [![Build Status](https://travis-ci.org/acusti/onscrolling.svg?branch=master)](https://travis-ci.org/acusti/onscrolling)

A better, smoother, more performant onscroll event interface based on the concepts from [this html5rocks tutorial][html5rocks-tutorial]. It uses `requestAnimationFrame` plus debouncing for performance and mobile-compatibility (thanks to the `touchmove` event), giving you a fighting chance to achieve the hallowed 60fps of lore with your scroll-listening UI.

[![NPM](https://nodei.co/npm/onscrolling.png?compact=true)](https://nodei.co/npm/onscrolling/)

## Usage

The module exports an `onscrolling` module if being used with a CommonJS or AMD module loader, or else exposes a global object as `window.onscrolling`.

### onscrolling( callback )

#### `callback` function

The function to call on a scroll event. In this default version, the module will only call the `callback()` when the page has been scrolled vertically. It will be passed the current vertical scroll position to the callback.

### onscrolling( direction, callback )

#### `direction` string

The scroll axis to monitor. Values can be `x` or `horizontal` to trigger when the page is scrolled horizontally, `y` or `vertical` to trigger when the page is scrolled vertically (the default behavior if no direction is provided), or `any` to trigger when the page is scrolled in any direction.

#### `callback` function

The function to call when the page is scrolled. It will be passed the current scroll position as a number if listening to a single scroll direction, or an array `[x,y]` if callback is listening for `any` scroll direction change.

### onscrolling.remove( fn )

#### `fn` function

The function to remove from the onscroll handler. In this default version, the function will be removed from the vertical scroll queue.

### onscrolling.remove( direction, fn )

#### `direction` string

The scroll axis that `fn` was listening for. Can be `x` or `horizontal`, `y` or `vertical`, or `any` to match how the function was originally attached. If a function was attached to multiple scroll directions, calling this method for a specific direction will only remove the listener for that direction.

#### `fn` function

The function to remove from the onscroll handler for the specified direction.

## Dependencies

None.

## Compatibility

Out of the box, onscrolling uses `requestAnimationFrame`, which is [only available in IE10+][raf-caniuse]. For older browsers, your scroll watchers simply won’t run. To add compatibility for those browsers, just include a [requestAnimationFrame polyfill][raf-polyfill].

## Tests

Tests use Mocha + Should.js + Sinon. Using `npm test` will run the tests in headless Chrome via mocha-chrome, but you can also open `test/index.html` directly in a browser.

## TODO

-   [ ] Add optional param to specify an object other than `window` to monitor for scroll events
-   [ ] Expose `measure` and `mutate` functions to attach handlers specifically to the measuring (read) or mutating (write) portion of each cycle to minimize layout calculations

## Misc

_Note: This package was formerly known as [jank-free-onscroll][]_

[html5rocks-tutorial]: http://www.html5rocks.com/en/tutorials/speed/animations/#debouncing-scroll-events
[raf-caniuse]: http://caniuse.com/#feat=requestanimationframe
[raf-polyfill]: https://gist.github.com/paulirish/1579671
[jank-free-onscroll]: https://github.com/acusti/jank-free-onscroll
