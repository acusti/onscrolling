import { Window } from 'happy-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import onscrolling from '../onscrolling.js';

const delay = (time: number) => new Promise((resolve) => setTimeout(resolve, time));

// @ts-expect-error happy-dom’s Window doesn’t satisfy globalThis.window’s type
globalThis.window = new Window({ url: 'https://localhost:8080' });
globalThis.document = window.document;
document.body.innerHTML =
    '<style>#fixture {min-width:200vw;min-height:200vh;}</style><div id="fixture"></div>';

function triggerScroll(direction?: 'x' | 'y' | 'any') {
    // first apply the scroll change
    if (direction === 'x') {
        window.scrollTo(window.scrollX + 3, window.scrollY);
    } else if (direction === 'any') {
        window.scrollTo(window.scrollX + 3, window.scrollY + 3);
    } else {
        window.scrollTo(window.scrollX, window.scrollY + 3);
    }
    // then trigger the scroll event
    window.dispatchEvent(new window.Event('scroll'));
}

describe('onscrolling', function () {
    beforeEach(async () => {
        window.scrollTo(0, 0);
    });

    it('defaults to triggering when scrollY position has changed', async () => {
        var onScrollFn = vi.fn();
        const cleanup = onscrolling(onScrollFn);
        triggerScroll();
        expect(onScrollFn.mock.calls.length).toBe(0);
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(1);
        cleanup();
    });

    it('when options.vertical is true, triggers when scrollY position has changed', async () => {
        var onScrollFn = vi.fn();
        const cleanup = onscrolling(onScrollFn, { vertical: true });
        triggerScroll('x');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(0);
        triggerScroll('y');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(1);
        cleanup();
    });

    it('when options.y is true, triggers when scrollY position has changed', async () => {
        var onScrollFn = vi.fn();
        const cleanup = onscrolling(onScrollFn, { y: true });
        triggerScroll('x');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(0);
        triggerScroll('y');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(1);
        cleanup();
    });

    it('when options.x is true, triggers when scrollX position has changed', async () => {
        var onScrollFn = vi.fn();

        const cleanup = onscrolling(onScrollFn, { x: true });
        triggerScroll();
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(0);
        triggerScroll('x');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(1);
        cleanup();
    });

    it('when options.horizontal is true, triggers when scrollX position has changed', async () => {
        var onScrollFn = vi.fn();

        const cleanup = onscrolling(onScrollFn, { horizontal: true });
        triggerScroll('x');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(1);
        cleanup();
    });

    it('when listening to both directions, triggers on horizontal and vertical scrolling', async () => {
        var onScrollFn = vi.fn();

        const cleanup = onscrolling(onScrollFn, {
            horizontal: true,
            vertical: true,
        });
        triggerScroll('x');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(1);
        triggerScroll('y');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(2);
        cleanup();
    });

    it('when listening to both directions, triggers once per scroll event, even if scroll is in both directions', async () => {
        var onScrollFn = vi.fn();

        const cleanup = onscrolling(onScrollFn, {
            horizontal: true,
            vertical: true,
        });
        triggerScroll('any');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(1);
        triggerScroll('y');
        await delay(16);
        expect(onScrollFn.mock.calls.length).toBe(2);
        cleanup();
    });
});

type ScrollEventPayload = { scrollX: number; scrollY: number };

describe('onscrolling callback', function () {
    beforeEach(async () => {
        window.scrollTo(0, 0);
    });

    it('passes a { scrollX, scrollY } payload on scroll event', async () => {
        let results: ScrollEventPayload | null = null;
        function onScrollFn(payload: ScrollEventPayload) {
            results = payload;
        }

        const cleanup = onscrolling(onScrollFn);
        triggerScroll();
        await delay(16);
        expect(results).not.toBeNull();
        expect(results!.scrollX === window.scrollX).toBe(true);
        expect(results!.scrollY === window.scrollY).toBe(true);
        cleanup();
    });

    it('passes a { scrollX, scrollY } payload on horizontal scroll for a horizontal scroll listener', async () => {
        let results: ScrollEventPayload | null = null;
        function onScrollFn(payload: ScrollEventPayload) {
            results = payload;
        }

        const cleanup = onscrolling(onScrollFn, { horizontal: true });
        triggerScroll('x');
        await delay(16);
        expect(results).not.toBeNull();
        expect(results!.scrollX === window.scrollX).toBe(true);
        cleanup();
    });
});
