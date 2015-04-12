(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    global.onscrolling = factory()
}(this, function () { 'use strict';

    'use strict';

    // Figure out proper requestAnimationFrame
    var requestFrame = window.requestAnimationFrame,
        cancelFrame  = window.cancelAnimationFrame,
        vendors      = ['ms', 'moz', 'webkit', 'o'];

    for (var i = 0; i < vendors.length && !requestFrame; i++) {
        requestFrame = window[vendors[i] + 'RequestAnimationFrame'];
        cancelFrame  = window[vendors[i] + 'CancelAnimationFrame'] ||
                       window[vendors[i] + 'CancelRequestAnimationFrame'];
    }

    // Module state
    var isSupported    = requestFrame !== undefined,
        isListening    = false,
        isQueued       = false,
        isIdle         = true,
        scrollY        = window.pageYOffset,
        scrollX        = window.pageXOffset,
        scrollYCached  = scrollY,
        scrollXCached  = scrollX,
        directionX     = ['x', 'horizontal'],
        directionAll   = ['any'],
        callbackQueue  = {
            x   : [],
            y   : [],
            any : []
        },
        detectIdleTimeout,
        tickId;

    // Main scroll handler
    // -------------------
    function handleScroll() {
        var isScrollChanged = false;
        if (callbackQueue.x.length || callbackQueue.any.length) {
            scrollX = window.pageXOffset;
        }
        if (callbackQueue.y.length || callbackQueue.any.length) {
            scrollY = window.pageYOffset;
        }

    	if (scrollY !== scrollYCached) {
            callbackQueue.y.forEach(triggerCallback.y);
            scrollYCached = scrollY;
            isScrollChanged = true;
        }
    	if (scrollX !== scrollXCached) {
            callbackQueue.x.forEach(triggerCallback.x);
            scrollXCached = scrollX;
            isScrollChanged = true;
        }
        if (isScrollChanged) {
            callbackQueue.any.forEach(triggerCallback.any);
            window.clearTimeout(detectIdleTimeout);
            detectIdleTimeout = null;
        }

        isQueued = false;
        requestTick();
    }

    // Utilities
    // ---------
    function triggerCallback(callback, scroll) {
        callback(scroll);
    }
    triggerCallback.y = function(callback) {
        triggerCallback(callback, scrollY);
    };
    triggerCallback.x = function(callback) {
        triggerCallback(callback, scrollX);
    };
    triggerCallback.any = function(callback) {
        triggerCallback(callback, [scrollX, scrollY]);
    };

    function enableScrollListener() {
        if (isListening || isQueued) {
            return;
        }
        if (isIdle) {
            window.addEventListener('scroll', onScrollDebouncer);
            document.body.addEventListener('touchmove', onScrollDebouncer);
            isListening = true;
            return;
        }
        requestTick();
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
        isIdle = false;
    	requestTick();
        disableScrollListener();
    }

    function requestTick() {
    	if (isQueued) {
            return;
    	}
        if (!detectIdleTimeout) {
            // Idle is defined as 1.5 seconds without scroll change
            detectIdleTimeout = window.setTimeout(detectIdle, 1500);
        }
    	tickId = requestFrame(handleScroll);
    	isQueued = true;
    }

    function cancelTick() {
    	if (!isQueued) {
            return;
    	}
    	cancelFrame(tickId);
    	isQueued = false;
    }

    function detectIdle() {
        isIdle = true;
        enableScrollListener();
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
        // If there's no listeners left, disable listening
        if (!callbackQueue.x.length && !callbackQueue.y.length && !callbackQueue.any.length) {
            cancelTick();
            disableScrollListener();
        }
    };
    onscrolling.off = onscrolling.remove;


    return onscrolling;

}));