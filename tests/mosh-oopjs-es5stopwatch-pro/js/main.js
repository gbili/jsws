'use strict';

// trying to use prototype chain for methods

function Stopwatch() {
  this.duration = 0;
  this.startTimeMs;
  this.started = false;
}

Stopwatch.prototype.throwIfRepeatedAction = function(action) {
  if (('start' === action && this.started)
    || ('stop' === action && !this.started)
    || ('reset' === action && this.duration === 0)) {
    throw new Error(`Cannot call ${action} twice in a row.`);
  }
};

Stopwatch.prototype.start = function() {
  this.throwIfRepeatedAction('start');
  this.startTimeMs = (new Date()).getTime();
  this.started = true;
}

Stopwatch.prototype.stop = function() {
  this.throwIfRepeatedAction('stop');
  this.started = false;
  this.duration += ((new Date()).getTime() - this.startTimeMs)/1000;
};

Stopwatch.prototype.reset = function() {
  this.throwIfRepeatedAction('reset');
  this.duration = 0;
}

const sw = new Stopwatch();

// This prototypal implementation has actually created a few problems:
// 1. We have exposed to the public 3 members (duration, startTimeMs, started)
//    -> violating the "clean interface principle": only expose the minimal
//       necessary members required to interact!
// 2. We have made 3 members WRITABLE!!
//    -> violating the "valid state principle": your objects should never
//       lie about their state! Now one can directly alter sw.duration = 23
//       which would be a lie!
// SOLUTIONS?
// There are no solutions to this, since the prototype can only access publicly
// accessible members of their children?
//
// LESSON: sometimes we want to optimize something (that acutally does not need
// an optimization, because probably only a few stop watch instances were going
// to be created, so trying to move methods to prototype was not going to 
// reduce memory so much. However, by doing so we end up creating more
// problems than we solve.a
// Dont solve what ain't broken!
// PREMATURE OPTIMIZATION IS THE ROOT OF ALL EVILS


