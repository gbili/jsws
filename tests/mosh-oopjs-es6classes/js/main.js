// Up until now we have seen prototypical inheritance
// But ES6 which is Javascript 2015 has added classes
// They are not all the same as Python and Java classes
// rather they are added syntactic sugar over the usual
// prototypical inheritance concepts that we have covered
// so far

// Look at this known case

function CircleUsualWay(radius) {
  this.radius = radius;
  this.describe = function() {
    console.log('this is an instance method'); // will be copied over and over
  };
}
CircleUsualWay.prototype.draw = function() {
  console.log('draw is a prototype method');
};

// Here is how we can achieve this case we have used so far

class Circle {
  constructor(radius) {
    this.radius = radius;
    this.describe = function() {
      console.log('this is how you achieve instance methods with new ES6 syntax');
    };
  }

  draw() {
    console.log('draw is a prototype method because it is outside constructor');
  }
}

const c = new Circle(10);

// What is the type of Circle?
console.log(typeof Circle); // function!
// even though we used the keyword 'class'
// to create the Circle class, Circle still
// ended up being a simple constructor function

// Classes are syntactic shugar for what we have 
// already learned. The only difference here,
// if we look at babel complier, is that classes
// have an added goodie, that if they are
// used without the 'new' operator then the
// compiler will complain and throw

// --------------------------------------------------
// 2. Hoisiting

// Function expressions (NOT Hoisted)
const sayHello = function() {};
// Function declaration (Hoisted)
function sayGoodbye() {}

// What is the difference between these two?
// Function declarations get hoisted, that means that
// there is no problem if we call the function before it
// is declared, because the declaration gets hoisted to the top
//
// On the other hand function expressions don't get hoisted
// and if you call it before you define it, the compiler will throw

// class Expression (Not Hoisted, no one uses it)
const Square = class {};

// class Declarations (Not Hoisted, use this one)
class Square {}

//--------------------------------------------------
// 3. Instance Methods vs Static Methods

class CircleStatDemo {
  constructor(radius) {
    this.radius = radius;
    this.describe = function() {
      console.log('this is how you achieve instance methods with new ES6 syntax');
    };
  }

  // instance method (available thorough inst.draw)
  draw() {
    console.log('draw is a prototype method because it is outside constructor');
  }

  // adding the static keyword makes the method only available through the ClassName.meth
  static parse() {
    console.log('this method will only be available on class level with CircleStaticDemo.parse()');
  }
}

CircleStatDemo.parse(); // no need to create an instance to use it
// Use static methods for utility functions that are not tied to 
// the state of the object itself.


//--------------------------------------------------
// 4. The 'this' keyword
// usually only when we enabled the 'strict mode'
// did we have the 'this' keyword assigned to 
// undefined when a method using 'this' keyword was
// called without 'new meth()' or without the hey.meth()

// in ES6, when using classes, the 'strict mode' is
// enabled by default

//--------------------------------------------------
// 5. Private Members using Symbols
//
// There are 3 different approaches to defining private
// members
//  1. this._myPrivMemberBecauseISayIt (BAD)
// the first one which is acutally very bad is a simple convention
// but it violates the Abstraction principle that requires
// object to not expose parts that should not be accessed from 
// the outside

//  2. using ES6 symbols : NOTICE WE CANNOT USE THE NEW keyword on SYMBOL
const _radius = Symbol();
console.log(Symbol() === Symbol()); // false, Every call to Symbol gives a diffrent ref

