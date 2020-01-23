'use strict';

function Stopwatch() {
  let duration = 0;
  let interval;
  let started = false;
  let increaseCounter = function () {
    duration++;
  };

  this.throwIfRepeatedAction = function(action) {
    if (('start' === action && started)
      || ('stop' === action && !started)
      || ('reset' === action && duration === 0)) {
      throw new Error(`Cannot call ${action} twice in a row.`);
    }
  };


  this.start = function() {
    this.throwIfRepeatedAction('start');
    interval = setInterval(increaseCounter, 1);
    started = true;
  }

  this.stop = function() {
    this.throwIfRepeatedAction('stop');
    started = false;
    clearInterval(interval);
  };

  this.reset = function() {
    this.throwIfRepeatedAction('reset');
    duration = 0;
  }

  Object.defineProperty(this, 'duration', {
    get: function() {
      return duration/1000;
    }
  });
}

const sw = new Stopwatch();

// The implementation above is actually really overkill, or simply bad.
// This is because I am using a interval that calls a function every
// millisecond. A much smarter approach would have been to get
// the Date time at the start, and Date time at the end, and compute
// the difference.
// start();
let startTime = new Date();
// stop()
let endTime = new Date();
const seconds = (endTime.getTime() - startTime.getTime()) / 1000;
