/* globals onscrolling */

// var should = require('should');

var requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame,
    fixture,
	totals;

function setupDocument() {
	document.documentElement.style.height = document.body.style.height = '100%';
	fixture = document.getElementById('fixture');
	fixture.style.height = '120%';
	fixture.style.width  = '120%';
	totals = {
		x: fixture.offsetLeft + fixture.clientWidth,
		y: fixture.offsetTop + fixture.clientHeight
	};
}

function dispatchScroll() {
	var scrollEvt = new Event('scroll');
	window.dispatchEvent(scrollEvt);
}

function triggerScroll(direction) {
	var newX = window.pageXOffset + window.innerWidth  >= totals.x ? 0 : window.pageXOffset + 3,
	    newY = window.pageYOffset + window.innerHeight >= totals.y ? 0 : window.pageYOffset + 3;
	if (direction === 'x' || direction === 'horizontal') {
		window.scrollTo(newX, window.pageYOffset);
	} else if (direction === 'any') {
		window.scrollTo(newX, newY);
	} else {
		window.scrollTo(window.pageXOffset, newY);
	}
	dispatchScroll();
}

describe('onscrolling', function() {
	beforeEach(function() {
		setupDocument();
	});

	it('defaults to triggering when scrollY position has changed', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling(onScrollFn);

		triggerScroll();

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;
			onscrolling.remove(onScrollFn);
			done();
		});
	});

	it('when direction is "x", triggers when scrollX position has changed', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('x', onScrollFn);
		triggerScroll('x');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;
			onscrolling.remove('x', onScrollFn);
			done();
		});
	});

	it('when direction is "horizontal", triggers when scrollX position has changed', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('horizontal', onScrollFn);
		triggerScroll('x');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;
			onscrolling.remove('x', onScrollFn);
			done();
		});
	});

	it('when direction is "any", triggers on scrollX position change', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('any', onScrollFn);

		triggerScroll('x');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;
			onscrolling.remove('any', onScrollFn);
			done();
		});
	});

	it('when direction is "any", triggers on scrollY position change', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('any', onScrollFn);
		triggerScroll('y');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;
			onscrolling.remove('any', onScrollFn);
			done();
		});
	});
});

describe('onscrolling callback', function() {
	beforeEach(function() {
		setupDocument();
	});

	it('defaults to passing the value of scrollY to registered listeners when vertical scroll position has changed', function(done) {
		var onScrollFn = function(scrollY) {
			(scrollY === window.pageYOffset).should.be.true;
			onscrolling.remove(onScrollFn);
			done();
		};

		onscrolling(onScrollFn);
		triggerScroll();
	});

	it('passes the value of scrollX to registered listeners when horizontal scroll position has changed', function(done) {
		var onScrollFn = function(scrollX) {
			(scrollX === window.pageXOffset).should.be.true;
			onscrolling.remove('x', onScrollFn);
			done();
		};

		onscrolling('x', onScrollFn);
		triggerScroll('x');
	});

	it('passes an array [x,y] to registered listeners of "any" scroll event when scroll position has changed', function(done) {
		var onScrollFn = function(scrollPoint) {
			(scrollPoint[0] === window.pageXOffset).should.be.true;
			(scrollPoint[1] === window.pageYOffset).should.be.true;
			onscrolling.remove('any', onScrollFn);
			done();
		};

		onscrolling('any', onScrollFn);
		triggerScroll();
	});
});

describe('onscrolling.remove', function() {
	beforeEach(function() {
		setupDocument();
	});

	it('defaults to removing scrollY watchers when onscrolling.remove is called', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling(onScrollFn);
		triggerScroll();

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;

			onscrolling.remove(onScrollFn);
			triggerScroll();

			requestFrame(function() {
				onScrollFn.calledOnce.should.be.true;
				done();
			});
		});
	});

	it('removes scrollX watchers when onscrolling.remove is called with direction "x"', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('x', onScrollFn);
		triggerScroll('x');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;

			onscrolling.remove('x', onScrollFn);
			triggerScroll('x');

			requestFrame(function() {
				onScrollFn.calledOnce.should.be.true;
				done();
			});
		});
	});

	it('removes scrollX watchers when onscrolling.remove is called with direction "horizontal"', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('x', onScrollFn);
		triggerScroll('x');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;

			onscrolling.remove('horizontal', onScrollFn);
			triggerScroll('x');

			requestFrame(function() {
				onScrollFn.calledOnce.should.be.true;
				done();
			});
		});
	});

	it('removes scroll x + y watchers when onscrolling.remove is called with direction "any"', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('any', onScrollFn);
		triggerScroll('x');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;

			onscrolling.remove('any', onScrollFn);
			triggerScroll('x');

			requestFrame(function() {
				onScrollFn.calledOnce.should.be.true;
				done();
			});
		});
	});
});
