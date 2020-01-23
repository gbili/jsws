// "Hot reloading"
// let timerId = setTimeout("location.reload(true);", 1000);

// Class #9
// Enumerating properties of an object
function Circle(radius) {
  this.radius = radius;
  this.draw = function () {
    console.log('draw');
  };
}

const circle = new Circle(10);

// this will fetch all the properties and methods
// of the actual object (not the prototype)
for (let key in circle) {
  console.log(key, circle[key])
}

// we can then filter the type of the key with the typeof operator
for (let key in circle) {
  if (typeof circle[key] !== 'function') {
    console.log(key, circle[key])
  }
}

// to get the keys as a list we can do
let manualKeys = [];
for (let key in circle) {
  // and within the loop we can then filter and process
  // stuff depending on the key
  manualKeys.push(key);
}
console.log(manualKeys);
// but if what you really want is just the full list of
// object keys (properties and methods) without inspecting or processing,
// then the builtin Object.keys(myObject) method is much faster
const keys = Object.keys(circle);
console.log(keys);

if ('radius' in circle) {
  console.log('there is a key named radius in object circle');
}

// Summary, use:
// "for in" to enumerate and do stuff on object keys
// Builtin Object.keys(myObject) to just get the full list
// "in" operator to test whether there is a certain key in the object

// Class #10
// Abstraction
// In OOP, "abstraction" means that you should hide the inner workings of
// an object, and only expose a "safe" public interface. You don't want
// anyone to be mingleing/altering/overriding your object properties creating
// unexpected behavior

function Circle2(radius) {
  this.radius = radius;

  this.defaultLocation = {x: 0, y: 0,};
  this.location = {};

  this.computeOptimalLocation = function() {
    for(let k in this.defaultLocation) {
      this.location[k] = this.defaultLocation[k];
    }
    this.location.x++;
    this.location.y--;
  };

  this.draw = function() {
    this.computeOptimalLocation();
    console.log('draw', this.location);
  };
}

const circle2 = new Circle2(10);
// we don't want anyone calling this
circle2.computeOptimalLocation();
// only when the draw() method is called do we want
// the this.computeOptimalLocation() to be called
// by our code

// How to implement Abstraction in javscript?
// So how do we hide the details?
// So far we have been using this.asdf in our Circle function
// But what happens if we use normal let variables?
function Circle3(radius) {
  this.radius = radius;
  let privateVariable;
}

const circle3 = new Circle3(10);
// we cannot access the local let variables from outside
// of the Circle function
console.log('privateVariable' in circle3); // false

// So if we want to hide 'this.defaultLocation' we do:
function CirclePriv(radius) {
  this.radius = radius;

  let defaultLocation = {x: 0, y: 0,};
  this.location = {};

  let computeOptimalLocation = function() {
    for(let k in this.defaultLocation) {
      this.location[k] = this.defaultLocation[k];
    }
    this.location.x++;
    this.location.y--;
  };

  this.draw = function() {
    computeOptimalLocation(); // notice that we removed the "this"
    console.log('draw', this.location);
  };
}
const circleWithPriv = new CirclePriv(10);
// in the example above, do you think that when we call
circleWithPriv.draw(); // draw {}
// the draw method will have access to computeOptimalLocation()?
// Yes, and the the answer lies in Closures! But more on that later,
// because we have already covered a topic that allows us to
// see a problem in the code.
// Why does
circleWithPriv.draw(); // draw {}
// output an empty object for this.location?
// Where is the this.location altered?
// First it is defined inside the scope of the constructor function
// This is why we can safely do:
console.log(circleWithPriv.location); // {}
// And we get the location property with it's initial value which is {}
// But then why does the call to computeOptimalLocation() not
// change the contents of this.location?
function CirclePrivBis(radius) {
  this.radius = radius;

  this.defaultLocation = {x: 0, y: 0,};
  this.location = {};

  let computeOptimalLocation = function() {
    console.log(this.defaultLocation);
    console.log(this.location);
    for(let k in this.defaultLocation) {
      this.location[k] = this.defaultLocation[k];
    }
    this.location.x++;
    this.location.y--;
  };

  this.draw = function() {
    computeOptimalLocation(); // notice that we removed the "this"
  };
}

const circlePrivBis = new CirclePrivBis(10);
circlePrivBis.draw();
// will print: 
// this.defaultLocation === undefined
// this.location === Location {replace: f, assign : f, href: "http://t.js/mosh-oopjs", ...}
// See what is going on?
// Because the function computeOptimalLocation uses "this"
// and we are calling it without the "new" operator, the
// "this" keyword references the "window" object, and therefore
// this.location is actually equivalent to window.location
// NOTE: if we run the script in "strict mode" with 'use strict'; we would
// get an: "Uncaught TypeError: Cannot read property 'defaultLocation' of undefined"
// This means that strict mode will set "this" to undefined instead of "window"
// which is convenient to avoid mistakes like this one.

// How can we solve this issue?
// By not using the "this" keyword outside of object methods like this:
function CirclePrivSolved(radius) {
  this.radius = radius;

  // change to let instead of "this" all vars that
  // will be accessed in Constructor inner functions that
  // are not part of the constructed object methods
  let defaultLocation = {x: 0, y: 0,};
  let location = {};

  let computeOptimalLocation = function() {
    'use strict';
    // remove all "this" keywords
    for(let k in defaultLocation) {
      location[k] = defaultLocation[k];
    }
    location.x++;
    location.y--;
  };

  this.draw = function() {
    computeOptimalLocation();
    console.log('draw:', location);
  };
}

const circlePrivSolved = new CirclePrivSolved(10);
circlePrivSolved.draw(); // draw {x: 1, y: -1}

// Closure
// First of, the scope of a function is all the variables
// that have been defined within the function.
// The scope is created and killed every time the function
// is called.
// On the other hand a closure is a function defined 
// within another function
// The inner function has access to the parent function's variables
// and contrary to the scope, these parent variables stay in
// memory throughout the whole life of the inner function
// NOTE: the parent variables are within the scope of the
// parent function, and they are within the closure of the inner function
// The main difference between the SCOPE and the CLOSURE is that
// the SCOPE is temporary, it dies after the function execution, 
// but the CLOSURE stays alive.


// Getters and Setters
// What if we want to be able to access defaultLocation variable from
// outside of the constructor function?
// Like: circlePrivSolved.defaultLocation
// Of course now we can't because it is not an object proerty, just a local
// variable to the constructor function.
// In an object oriented persective we can actually call this a private property
// that we could expose like:

function CirclePrivExposed(radius) {
  //...
  let defaultLocation = {x: 0, y: 0,};
  //...
  this.getDefaultLocation = function() {
    return defaultLocation;
  };
}
const circle5 = new CirclePrivExposed(10);
console.log(circle5.getDefaultLocation());

'use strict';
// But there is a nicer way that allows calling it like a normal property
// yet forbidding users to reset it
// READ-ONLY property
function CirclePrivReadOnly(radius) {
  //...
  let defaultLocation = {x: 0, y: 0,};
  //...
  Object.defineProperty(this, 'defaultLocation', {
    get: function () {
      return defaultLocation;
    },
  });
}
const circle6 = new CirclePrivReadOnly(10);
console.log('circle6:', circle6.defaultLocation); // {x: 0, y: 0}
circle6.defaultLocation = 1; // changes nothing because there is no setter
console.log('circle6:', circle6.defaultLocation); //still {x: 0, y: 0}

// READ-WRITE property
// Let's create a Setter
function CirclePrivReadWrite(radius) {
  //...
  let defaultLocation = {x: 0, y: 0,};
  //...
  Object.defineProperty(this, 'defaultLocation', {
    get: function () {
      return defaultLocation;
    },
    set: function (value) {
      defaultLocation = value;
    }
  });
}
const circle7 = new CirclePrivReadWrite(10);
console.log('circle7:', circle7.defaultLocation); // {x: 0, y: 0}
circle7.defaultLocation = 1; // changes nothing because there is no setter
console.log('circle7:', circle7.defaultLocation); // 1 
// We are now allowing anyone to change the default location
// but most of the times we want to control the input, and that can be done
// through the the setter method by throwing an error like this:

function CirclePrivReadWriteControlled(radius) {
  //...
  let defaultLocation = {x: 0, y: 0,};
  //...
  Object.defineProperty(this, 'defaultLocation', {
    get: function () {
      return defaultLocation;
    },
    set: function (value) {
      console.log(value);
      if (typeof value !== 'object' || !('x' in value) || !('y' in value)) {
        // Error is a constructor for error
        throw new Error('value must have x and y properties');
      }
      defaultLocation = value;
    }
  });
}
const circle8 = new CirclePrivReadWriteControlled(10);
console.log('circle8:', circle8.defaultLocation); // {x: 0, y: 0}
circle8.defaultLocation = 1; // Uncaught Error: value must have x and y properties

