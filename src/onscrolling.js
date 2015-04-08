'use strict';

var requestFrame  = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
    isSupported    = requestFrame !== undefined,
    isListening    = false,
    isQueued       = false,
    scrollY        = window.pageYOffset,
    scrollX        = window.pageXOffset,
    scrollYCached  = scrollY,
    scrollXCached  = scrollX,
    directionX     = ['x', 'horizontal'],
    // directionY     = [ 'y', 'vertical'],
    directionAll   = ['any'],
    callbackQueue  = {
        x   : [],
        y   : [],
        any : []
    };

function handleScroll() {
	var i;
    if (callbackQueue.x.length || callbackQueue.any.length) {
        scrollX = window.pageXOffset;
    }
    if (callbackQueue.y.length || callbackQueue.any.length) {
        scrollY = window.pageYOffset;
    }

	if (scrollY !== scrollYCached) {
        for (i = 0; i < callbackQueue.y.length; i++) {
    		callbackQueue.y[i](scrollY);
    	}
        scrollYCached = scrollY;
    }
	if (scrollX !== scrollXCached) {
        for (i = 0; i < callbackQueue.x.length; i++) {
    		callbackQueue.x[i](scrollX);
    	}
        scrollXCached = scrollX;
    }
    for (i = 0; i < callbackQueue.any.length; i++) {
        callbackQueue.any[i]([scrollX, scrollY]);
    }

    isQueued = false;
    enableScrollListener();
}

function requestTick() {
	if (!isQueued) {
		requestFrame(handleScroll);
	}
	isQueued = true;
}

function enableScrollListener() {
    if (isListening) {
        return;
    }
    window.addEventListener('scroll', onScrollDebouncer);
    document.body.addEventListener('touchmove', onScrollDebouncer);
    isListening = true;
}

function disableScrollListener() {
    if (!isListening) {
        return;
    }
    window.removeEventListener('scroll', onScrollDebouncer);
    document.body.removeEventListener('touchmove', onScrollDebouncer);
    isListening = false;
}

function onScrollDebouncer() {
	requestTick();
    disableScrollListener();
}

/**
 * Attach callback to debounced scroll event
 *
 * Takes two forms:
 * @param function callback  Function to attach to a vertical scroll event
 * Or:
 * @param string   direction Direction of scroll to attach to:
 *                 'horizontal'/'x', 'vertical'/'y' (the default),
 *                 or 'any' (listens to both)
 * @param function callback  Function to attach to a scroll event in specified direction
 */
function onscrolling(direction, callback) {
	if (!isSupported) {
		return;
	}
	enableScrollListener();
    // Verify parameters
    if (typeof direction === 'function') {
        callback = direction;
        callbackQueue.y.push(callback);
        return;
    }
    if (typeof callback === 'function') {
        if (~directionX.indexOf(direction)) {
            callbackQueue.x.push(callback);
        } else if (~directionAll.indexOf(direction)) {
            callbackQueue.any.push(callback);
        } else {
            callbackQueue.y.push(callback);
        }
    }
}

onscrolling.remove = function(direction, fn) {
    var queueKey = 'y',
        queue,
        fnIdx;

    if (typeof direction === 'string') {
        // If second parameter is not a function, return
        if (typeof fn !== 'function') {
            return;
        }
        if (~directionX.indexOf(direction)) {
            queueKey = directionX[0];
        } else if (~directionAll.indexOf(direction)) {
            queueKey = directionAll[0];
        }
    } else {
        fn = direction;
    }
    queue = callbackQueue[queueKey];
    fnIdx = queue.indexOf(fn);
    if (fnIdx > -1) {
        queue.splice(fnIdx, 1);
    }
};
onscrolling.off = onscrolling.remove;

export default onscrolling;
