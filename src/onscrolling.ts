// Module state
let isListening = false;
let isQueued = false;
let isIdle = true;
let scrollY = window?.scrollY;
let scrollX = window?.scrollX;
let scrollYCached = scrollY;
let scrollXCached = scrollX;
let detectIdleTimeout: number | null = null;
let tickID: number | null = null;
const callbackQueue: { x: Array<Callback>; y: Array<Callback> } = {
    x: [],
    y: [],
};

// Main scroll handler
// -------------------
function handleScroll() {
    let isScrollChanged = false;
    if (callbackQueue.x.length) {
        scrollX = window.scrollX;
    }

    if (callbackQueue.y.length) {
        scrollY = window.scrollY;
    }

    const payload = { scrollX, scrollY };
    const calledBack = new Set<Callback>();

    if (scrollY !== scrollYCached) {
        callbackQueue.y.forEach((callback) => {
            callback(payload);
            calledBack.add(callback);
        });
        scrollYCached = scrollY;
        isScrollChanged = true;
    }

    if (scrollX !== scrollXCached) {
        callbackQueue.x.forEach((callback) => {
            // only trigger callbacks once per scroll event
            if (calledBack.has(callback)) return;
            callback(payload);
        });
        scrollXCached = scrollX;
        isScrollChanged = true;
    }

    if (isScrollChanged) {
        if (detectIdleTimeout != null) {
            clearTimeout(detectIdleTimeout);
            detectIdleTimeout = null;
        }
    }

    isQueued = false;
    requestTick();
}

// Utilities
// ---------
function enableScrollListener() {
    if (isListening || isQueued) return;

    // reset scroll position cache
    scrollXCached = scrollX = window?.scrollX;
    scrollYCached = scrollY = window?.scrollY;

    if (isIdle) {
        isListening = true;
        window.addEventListener('scroll', onScrollDebouncer);
        document.body.addEventListener('touchmove', onScrollDebouncer);
        return;
    }

    requestTick();
}

function disableScrollListener() {
    if (!isListening) return;

    window.removeEventListener('scroll', onScrollDebouncer);
    document.body.removeEventListener('touchmove', onScrollDebouncer);
    isListening = false;
}

function onScrollDebouncer() {
    isIdle = false;
    requestTick();
    disableScrollListener();
}

function requestTick() {
    if (isQueued) return;

    if (detectIdleTimeout == null) {
        // Idle is defined as 1.5 seconds without scroll change
        detectIdleTimeout = setTimeout(detectIdle, 1500);
    }

    tickID = requestAnimationFrame(handleScroll);
    isQueued = true;
}

function cancelTick() {
    if (!isQueued) return;

    if (tickID != null) {
        cancelAnimationFrame(tickID);
        tickID = null;
    }

    isQueued = false;
}

function detectIdle() {
    isIdle = true;
    cancelTick();
    enableScrollListener();
}

type Callback = (payload: { scrollX: number; scrollY: number }) => void;

type Options = {
    horizontal?: boolean;
    vertical?: boolean;
    x?: boolean;
    y?: boolean;
};

/**
 * Attach callback to debounced scroll event
 *
 * @param function callback  Function to attach to a scroll event in specified direction
 * @param object   options   Direction of scroll to attach to:
 *                 'horizontal'|'x' and/or 'vertical'|'y' (the default)
 */
function onscrolling(callback: Callback, options: Options = {}) {
    enableScrollListener();

    let { x, y, horizontal = x, vertical = y } = options;
    if (!horizontal && !vertical) {
        vertical = true;
    }

    if (horizontal) {
        callbackQueue.x = callbackQueue.x.concat(callback);
    }

    if (vertical) {
        callbackQueue.y = callbackQueue.y.concat(callback);
    }

    return () => {
        removeListener(callback, options);
    };
}

function removeListener(callback: Callback, options: Options = {}) {
    let { x, y, horizontal = x, vertical = y } = options;
    if (!horizontal && !vertical) {
        vertical = true;
    }

    if (horizontal) {
        const index = callbackQueue.x.indexOf(callback);
        if (index > -1) {
            callbackQueue.x = callbackQueue.x.toSpliced(index, 1);
        }
    }

    if (vertical) {
        const index = callbackQueue.y.indexOf(callback);
        if (index > -1) {
            callbackQueue.y = callbackQueue.y.toSpliced(index, 1);
        }
    }

    // If there are no listeners left, disable listening
    if (!callbackQueue.x.length && !callbackQueue.y.length) {
        cancelTick();
        disableScrollListener();
    }
}

export default onscrolling;
