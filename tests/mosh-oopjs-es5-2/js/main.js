// every object has a reference to the constructor that
// was used to instantiate it

function Shape() {
}

Shape.prototype.duplicate = function () {
  console.log('duplicate');
}

function Circle(radius) {
  this.radius = radius;
}

// ---------------------------------------------
// --- Object.create() vs new FunctionName() ---

// Object.create() creates a new object
// which inherits directly from PARAM
let PARAM = {};
let a = Object.create(PARAM);

// new FuncName() inherits from FuncName.prototype
let b = new Shape();

// To make both behave the same you can:
a = Object.create(Shape.prototype);
b = new Shape();
console.log(a, b); // same because no constructor content
// This creates two objects which inherit
// (have a __proto__ === Shape.prototype
// So new X <=> Object.create(X.prototype) except
// that new X, will run the constructor function
// and Object.create won't.
// By running the constructor function of X,
// new X allows the constructor to set instance properties,
// and to return the actual object for the new expression
b = new Shape(); // Shape method is run and
// its return value can be used as the return of new
// instead of the default 'this' when there is no return
// Ex :
function Hello() {
  this.hi = 'some content set on construction';
}
let c = Object.create(Hello.prototype);
let d = new Hello();
console.log(c, d); // different
// c is an empty Hello (because no constructor was run)
// d is a Hello with hi property set to 'some content...'
// ---------------------------------------------

// Now that we know the difference between new and Object.create
// we understand why using Object.create is preferrable in our case:
//    Beacause we only want to get a specific proto; we don't want
//    run the Shape constructor. Why?
//
// we are reseting the prototype of Circle
// to an object whose prototype will be Shape.prototype
Circle.prototype = Object.create(Shape.prototype);
// Once we reset Circle.prototype to be an object whose
// __proto__ is the desired parent (here Shape)
// Now we can start adding Circle specific stuff to
// the actual Circle.prototype whose __proto__ is Shape
Circle.prototype.draw = function() {
  console.log('we could draw something from the circle')
}

// The new opertator will run the Circle function as a constructor
let e = new Circle(1);
// but if we inspect the e object, we notice that there is no
console.log(e.constructor === Circle);// false
// constructor in its direct prototype, and the only one available
// is actually further up in the inheritance chain in the Shape.prototype
// which is Circle.prototype.__proto__
console.log(e);
console.log(e.constructor); // f Shape

// Q: Why is it that the new operator on Circle function did not
// store a constructor in e.__proto__
// A: Very simple, the new operator is not in charge for that.
// The Hello.prototype was not altered like Circle's one, and
// therefore it should have a constructor property:
console.log(Hello.prototype.constructor); // f Hello
// When we create the Hello funciton, a constructor property
// is directly added to its prototype property
// And because we overwrite the Circle.prototype with
// an empty object whose __proto__ is Shape.prototype,
// any object instantiated from Circle, will not have a
// constructor property on its __proto__ which is Circle.prototype
// that we reassigned to Object.create(Shape.prototype)
//
// How do we solve this lack of constructor?

Circle.prototype.constructor = Circle;
// This will effectively create a property named constructor
// on Circle.prototype pointing to Circle function
// Note: the problem is not that the 'new' operator does not
// call Circle for construction. The problem is that even though
// Circle function is used as constructor, we loose the reference
// to it on the constructed object's __proto__ because we override
// the Circle's default prototype usually containing it.
// That is why we simply reset it.
let f = new Circle(2);
console.log(f.constructor === Circle);// true

// Summary
function Square(side) {
  this.side = side;
}
Square.prototype = Object.create(Shape.prototype);
Square.prototype.constructor = Square;
Square.prototype.getArea = function () {
  console.log(this.side*2);
};
let g = new Square(2);
g.getArea();
