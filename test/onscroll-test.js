/* globals onscrolling */

// var should = require('should');

var requestFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

function setupDocument() {
	var fixture = document.getElementById('fixture');
	fixture.style.height = '120%';
	fixture.style.width = '120%';
	document.documentElement.style.height = document.body.style.height = '100%';
}

function dispatchScroll() {
	var scrollEvt = new Event('scroll');
	window.dispatchEvent(scrollEvt);
}

function triggerScroll(direction) {
	var newX = window.pageXOffset ? 0 : 10,
	    newY = window.pageYOffset ? 0 : 10;
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
			done();
		});

	});

	it('when direction is "x", triggers when scrollX position has changed', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('x', onScrollFn);
		triggerScroll('x');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;
			done();
		});
	});

	it('when direction is "horizontal", triggers when scrollX position has changed', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('horizontal', onScrollFn);
		triggerScroll('x');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;
			done();
		});
	});

	it('when direction is "any", triggers on scrollX position change', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('any', onScrollFn);

		triggerScroll('x');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;
			done();
		});
	});
	// TODO: add a function that takes a callback, creates the spy, triggerscroll x and/or y, and calls the callback at the end with the spy as the param

	it('when direction is "any", triggers on scrollY position change', function(done) {
		var onScrollFn = sinon.spy();

		onscrolling('any', onScrollFn);
		triggerScroll('y');

		requestFrame(function() {
			onScrollFn.calledOnce.should.be.true;
			done();
		});
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
