// 3 . Calling the Super Constructor
function Shape(color) {
  this.color = color;
}

Shape.prototype.duplicate = function() {
  console.log('duplicate');
}

function Circle(radius) {
  this.radius = radius;
}

Circle.prototype = Object.create(Shape.prototype);
Circle.prototype.constructor = Circle;
Circle.prototype.draw = function() {
  console.log('draw');
}

const s = new Shape('green'); // color property is set to green
const c = new Circle(2); // color property not set, only radius

// notice that we have added a color parameter 
// to Shape's constructor but if we inspect c
// there is no reference to the color.
// It makes some sense since only Circle's
// constructor is called with the new operatr.
//
// Quick review of 'new' operator
// When calling new operator, 3 things happen
// 1. a new empty object is created
// 2. this inside the constructor is assigned to that object
// 3. the object is returned on the constructor
// note : if a constructor is called without  the 'new'
//        operator, then this is assigned to the global object

// How do we need to call Shape(color) from the Circle
// constructor in order make it work on the 
// object created by the new operator called on Circle?

function CircleBad(radius, color) {
  Shape(color); // bad
  this.radius = radius;
}

const cb = new CircleBad(2, 'red');
console.log(cb.color); // undefined
// the color property has been set on 'window' obejct
console.log(window.color); // red...

// ------------------------------------------------
// THE RIGHT WAY to call the Super Constructor

function CircleGood(radius, color) {
  Shape.call(this, color);
  this.radius = radius;
}
CircleGood.prototype = Object.create(Shape.prototype);
CircleGood.prototype.constructor = Circle;
CircleGood.prototype.draw = function() {
  console.log('draw');
}
const cc = new CircleGood(2, 'green');
console.log(cc.color); // green! good

// MyFunc.call(usAsThis, MyFuncParam1, ...)
// The call method takes the object that should be
// used as the 'this' and the other params are the
// function's parameters
//

// --------------------------------------------------
// 4. Intermediate Function Inheritance
// We want to create an extend() method to 
// avoid having to type:
// Square.prototype = Object.create(Shape.prototype);
// Square.prototype.constructor = Square;

function extend(Child, Parent) {
  Child.prototype = Object.create(Parent.prototype);
  Child.prototype.constructor = Child;
}

// Let's create a square that inherits from Shape
function Square(size) {
  this.size = size;
}

extend(Square, Shape);

const sq = new Square(3);
console.log(sq.duplicate); // works, points to parent's method

// --------------------------------------------------
// 5. Let's consider method overriding, that means
// we want to override a method from the parent that does not
// perfectly fit the needs of the child
// Here let's assume that Shape's duplicate method does
// not fit the Circle's needed behavior, so we are going to override it
// Really simple: just create that property on child's prototype after
// having "extended" the parent (reseted the childs prototype with an
// object whose __proto__ is the desired parent

Circle.prototype.duplicate = function() {
  console.log(`overriding the parent's duplicate method`);
}

const cd = new Circle(2);

cd.duplicate(); //`overriding the parent's duplicate method`
// Notice that eventhough we did not overWRITE the parent's
// 'duplicate' method, Javascript will look at the prototypical
// chain for a property named 'duplicate' and will call the 
// first one it finds starting from child and going up to the parents

// Sometimes you want to call the implementation on the parents aswell

Circle.prototype.duplicate = function() {
  // if not using 'this' in the parent method, then you can:
  // Shape.prototype.duplicate();
  // otherwise if using 'this' inside the parent method, then you have to
  Shape.prototype.duplicate.call(this);

  console.log(`overriding the parent's duplicate method`);
}

// will execute parent and child duplicate methods
cd.duplicate(); // 'duplicate' and `overriding the parent's duplicate method`

// --------------------------------------------------
// 6. Polymorphism : "many forms"

Square.prototype.duplicate = function() {
  console.log('duplicating a square');
}

// Now we have many objects extending the Shape object
// We have Circle and Square, and both have their own version
// of the 'duplicate' method. So we have many forms of the
// same method. This is what is called Polymorphism

// This is very powerful because now we do not need to
// add an if statement to check whether the object is of
// a given type to call one or the other method, it is all
// builtin and javascript will know which method to call
// for what type of object.
// From this:
let myShapes = [sq, cd];
for (let shape of myShapes) {
  if (shape.constructor.name === 'Circle') {
    // CircleDuplicate(shape)
  } else if (shape.constructor.name === 'Square') {
    // SquareDuplicate(shape)
  } else {
    // duplicate for this kind not implemented
  }
}
// Instead thanks to oop
// now we can simply
for (let shape of myShapes) {
  shape.duplicate();
}
// This is pretty cool and is what we call polymorphism in action

// --------------------------------------------------
// 7. When to use Inheritance?
// While inheritance is pretty powerful, be careful when you use it
// because it can make your code complex and fragile
// The base principle is : Keep it simple STUPID
// See Strategy pattern to see when to use something else called Composition

// Avoid creating more than one layer of inheritance,
// Grandparents are way too old for anything
// By the Strategy pattern we should use Composition instead
// and this in javascript is done through Mixins

// --------------------------------------------------
// 8. Mixins : a way to apply the strategy pattern through composition

const canEat = {
  hunger: 10,
  eat: function() {
    this.hunger--;
    console.log('eating');
    return this.hunger;
  },
};
const canWalk = {
  walk: function() {
    console.log('walking');
  }
};
const canSwim = {
  swim: function() {
    console.log('swimming');
  }
};

function Person() {
}

Object.assign(Person.prototype, canEat, canWalk);

const p = new Person(10);
console.log(p.eat());

// Now we can create a fish
function Fish() {
}

// Instead of calling the Mixin manually, lets abstract it in a function
// the '...' is the 'rest' operator in this case,
// it will create a list from a set of parameters passed after the first
function mixin(target, ...sources) {
  // the '...' is the 'spread' operator in this case,
  // it will spread the list as if they were individual paramters
  Object.assign(target, ...sources);
}

// Don't forget to pass .prototype
mixin(Fish.prototype, canEat, canSwim);

const f = new Fish(5);
console.log(f.eat(), f.swim()); // 'eating' 4 and 'swimming'

// The Object.assign(target, ...sources) will actually assign all
// the 'source' object's methods to the 'target' object as if
// they had been defined on the target object itself.

// One limitation we can see is: what happens if you want to
// set different levels on hunger depending on the kind of object?
// For example a person starts with a hunger of 10, whereas a
// Fish would start with a hunger of 5?
// We could already modify our initial mixins to be constructors 

function CanEat(hunger) {
  this.hunger = hunger;
  this.eat = function() {
    this.hunger--;
    console.log('eating differently');
    return this.hunger;
  }
}

function GoldFish() {
}

function AmazingPerson() {
}

mixin(GoldFish.prototype, new CanEat(5), canSwim);
mixin(AmazingPerson.prototype, new CanEat(20), canWalk);

const gf = new GoldFish();
const ap = new AmazingPerson();

// WORKS!
console.log(gf.eat()); // 'eating differently' 4
console.log(ap.eat()); // 'eating differently' 19

// Now what happens if we want to set the hunger level
// on construction of the Fish or Person? (maybe there is no point for
// it, but let's ignore that for a moment)
// We could directly implement the 'this.hunger' inside the constructors
// like:

function MagicFish(hunger) {
  this.hunger = hunger;
}

mixin(MagicFish.prototype, canEat, canSwim);

const mf = new MagicFish(33);
console.log(mf.eat()); // 'eating' 32'

function SpecialPerson(hunger) {
  this.hunger = hunger;
}

mixin(SpecialPerson.prototype, new CanEat(12), canSwim);
// The initial hunger = 12 gets overriden by 44
const sp = new SpecialPerson(44);
console.log(sp.eat()); // 'eating' 43
