# Jank-free onscroll

A better, smoother, more performant onscroll event interface based on the concepts from [this html5rocks tutorial][html5rocks-tutorial]. It uses `requestAnimationFrame` plus debouncing for performance and mobile-compatibility (thanks to the `touchmove` event), giving you a fighting chance to achieve the hallowed 60fps of lore with your scroll-listening UI.

## Usage

The object exports an `onscrolling` module if being used with a Common JS or AMD module loader, or else exposes a global object as `window.onscrolling`.

### `onscrolling( callback )`

#### `callback` function

The function to call on a scroll event. In this default version, the module will only call the `callback()` when the page has been scrolled vertically.

### `onscrolling( direction, callback )`

#### `direction` string

The scroll axis to monitor. Values can be `x` or `horizontal` to trigger when page is scrolled horizontally, or `any` to trigger when page is scrolled in any direction.

#### `callback` function

The function to call when the page is scrolled.

### `onscrolling.remove( fn )`

#### `fn` function

The function to remove from the onscroll handler. In this default version, the function will be removed from the vertical scroll queue.

### `onscrolling( direction, fn )`

#### `direction` string

The scroll axis that `fn` was listening for. Can be `x` or `horizontal`, or `any`, however the function was originally attached. If a function was attached to multiple scroll directions, you can remove only one of those listeners by calling this once for that direction.

#### `fn` function

The function to remove from the onscroll handler for the specified direction.

## Dependencies

None, accept to run the tests.

## Compatibility

Out of the box, onscrolling uses `requestAnimationFrame`, which is [only available in IE10+][raf-caniuse]. For older browsers, your scroll watchers simply won’t run. To add compatibility for those browsers, just include a [requestAnimationFrame polyfill][raf-polyfill].

## Tests

Tests use Mocha + Should.js + Sinon and must be run in a browser. Just open `test/index.html` in a browser (should even work using the `file://` protocol).

## TODO

- [ ] Add optional param to specify an object other than `window` to monitor for scroll events

[html5rocks-tutorial]: http://www.html5rocks.com/en/tutorials/speed/animations/#debouncing-scroll-events
[raf-caniuse]: http://caniuse.com/#feat=requestanimationframe
[raf-polyfill]: https://gist.github.com/paulirish/1579671
