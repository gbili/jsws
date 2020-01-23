//Summary of construction:
//function MyConstr() {
//   this.constrMember = function() { console.log('constrMember function'); };
//}
// -> this will create a variable MyConstructor (in current scope): of type Function
// MyConstr inherits all the properties from the FunctionBase < ObjectBase
//
// MyConstr:
//   __proto__ = FunctionBase
//       |. __proto__ = ObjectBase
//
//   ... inherits...
//   Function::prototype
//       ObjectBase::constructor -> points to MyConstr
//   ...
//
// and
//
// MyConstr.prototype is an object and inherits from ObjectBase. Specifically:
//   __proto__ = ObjectBase
//
//   ... inherits...
//   ObjectBase::constructor -> points back to MyConstr
//   ...
//
// now if we add:
//
// MyConstr.prototype.myProtoMethod = function() { console.log('myProtoMethod'); };
//
// then it becomes
//
// MyConstr.prototype:
//   __proto__ = ObjectBase
//   myProtoMethod -> function ... defined just above
//
//   ... inherits...
//   ObjectBase::constructor -> points back to MyConstr
//   ...
//
// MyConstr.prototype has a reference to MyConstr through :
//
// MyConstr.(Function::prototype).(ObjectBase::constructor) === MyConstructor
//
// now the moment we have all been waiting for:
//
// let myInst = new MyConstr;
//
// myInst
//   __proto__ === MyConstr.prototype
//       |. __proto__ = ObjectBase
//   constrMember = copied from MyConstr() {this.constrMember = function() {...}}
//
//   ... inherits...
//   MyConstr.prototype::myProtoMethod -> a method defined in the MyConstr.prototype
//       ObjectBase::constructor -> points back to MyConstr
//   ...

// Creating your own Prototypical Inheritance

// In our example where we had a Circle being a Shape
// and a Square being a Shape too.
//
// The main goal is to be able to have the "shapeBaseMethod" method
// defined in one place such that when we define our Square
// "class", we don't need to redefine it again.
// This is why we go through the trouble of creating a class
// Shape, and then try to inherit its useful functions
// from Circle and Square.

// How do we go about implementing this inheritance?

function Shape() {
  // this method is defined for illustration purposes only
  this.shapeConstructorMethod = function() {
    console.log('shapeConstructorMethod');
  }
}

// We define the "shapeBaseMethod" method in the Shape prototype
Shape.prototype.shapeBaseMethod = function() {
  console.log('shapeBaseMethod');
}

function Circle(radius) {
  this.radius = radius;
}

Circle.prototype.circleBaseMethod = function() {
  console.log('circleBaseMethod');
}

const s = new Shape();
let c = new Circle(1);
// With this, we have two objects s and c that inherit from
// their own base (i.e. s inheirts from "shapeBase" which is
// Shape.prototype (the default prototype for new objects customized
// with our method "shapeBaseMethod")).
// s.__proto__ (we call it shapeBase) inherits from objectBase

// Object.getPrototypeOf(s) or Shape.prototype
let shapeBase = s.__proto__;
// Object.getPrototypeOf(c) or Circle.prototype
let circleBase = c.__proto__; 
// Object.getPrototypeOf(shapeBase) or Shape.prototype.__proto__
// Object.getPrototypeOf(circleBase) or Circle.prototype.__proto__
let objectBase = shapeBase.__proto__; 
// or we could have gotten it from circle
// let objectBase = circleBase.__proto__; 

console.log(
  `circleBase.__proto__ is actually === objectBase`,
  circleBase.__proto__ === shapeBase.__proto__,
  objectBase === circleBase.__proto__,
  objectBase === {}.__proto__
);

// Now how do we go about giving circleBase access to all shapeBase methods?
// one way is:
circleBase.__proto__ = shapeBase
console.log(circleBase);
let asdf = new Circle(2);
console.log('i can call asdf.shapeBaseMethod', asdf.shapeBaseMethod);
console.log('can i call asdf.shapeConstructorMethod', asdf.shapeConstructorMethod); //undefined
// shapeConstructorMethod does not get passed along since this process is done
// when we use the "new" operator on the constructor. During this process, the
// "new" will create an object whose __proto__ is Constr.prototype, and whose
// members are defined in Constr() { this.asdf = asdf, this.oiu = funct.. etc. }
// And since we are using Circle constructor instead of Shape, the shape constructor
// this.memebers are not transfered to the new object.

// Now how do we go about making circleBase.__proto__ === shapeBase?
// IMPORTANT: notice we are saying cirlceBase.__proto__ and not Circle.prototype
// circleBase.__proto__ is Circle.prototype.prototype
console.log('circleBase proto is initially objectBase:', circleBase.__proto__ === objectBase);
console.log('circleBase proto is:', Circle.prototype);
// meaning that c < circleBase < shapeBase < objectBase
// or equivale. c < Circle.prototype < Shape.prototype < Object.prototype
let initialCirclePrototype = Circle.prototype; // keep track of the initial

// Can we make this test suite succeed: 
let properPrototypeChainTests = [
  (o) => o.__proto__ === Circle.prototype,
  (o) => 'circleBaseMethod' in o,
  (o) => o.__proto__.__proto__ === Shape.prototype,
  (o) => 'shapeBaseMethod' in o,
  (o) => o.__proto__.__proto__.__proto__ === {}.__proto__,
];

// works" only if object instantiated after we reassign the Circle.prototype
//
// REMEMBER: ------------------ MyConstructor.prototype is the Object that will
// be cloned and used as the new MyConstructor() return value, which is
// ultimately our newly instantiated object.
function MyConstructor(param) {
  this.ownAttribute = 'ownAttr:' + param;
  this.ownMethod = function() {
    console.log('ownMethod');
  };
}
MyConstructor.prototype.protoMethod = function() {
  console.log('protoMethod');
};
MyConstructor.prototype.protoAttribute = 'protoAttribute';

let my = new MyConstructor('constrParam');
console.log(my);

// o = new MyConstructor();
//

// WAY #1 BAD
Circle.prototype = Shape.prototype;
// What is wrong with this? -> we are overriding the Circle.prototype
// Where is the Circle.prototype.circleBaseMethod method now? VANISHED! BAD!
// We want to be able to keep the Circle.prototype
c = new Circle(12);
console.log(`first test run`);
for (let test of properPrototypeChainTests) {
  console.log(test, test(c)); // true, false, false, true, false
}
console.log(`we trashed "circleBaseMethod" method`);
console.log(`instead of desired shapeBase, we made 2nd parent objectBase:`, c.__proto__.__proto__);
console.log(`instead of desired objectBase, we made 3nd parent null:`, c.__proto__.__proto__.__proto__);

// reset to original
Circle.prototype = initialCirclePrototype

// WAY #2
// the key difference is that we are creating an object
// which uses the Shape.prototype as its __proto__
let objectHavingShapeAsProto = new Shape();
// and we assign it to the Circle.prototype, this means that 
// Circle.prototype is an object having Shape.prototype as its __proto__
// and also will have Shape's methods and members
Circle.prototype = objectHavingShapeAsProto;
// now c < Circle.prototype < Shape.prototype < {}.__proto__
c = new Circle(12);
console.log(`second test run`);
for (let test of properPrototypeChainTests) {
  console.log(test, test(c)); // true, false, true, true, true
}
// failed test is the Circle.prototype.circleBaseMethod method
console.log(`we still trashed "circleBaseMethod" method`);
// We can fix this with:
Circle.prototype.circleBaseMethod = initialCirclePrototype.circleBaseMethod;
console.log(
  `And notice we are having all Shape's methods`,
  c,
  `So each new Circle has a __proto__ composed of 
the Circle.prototype methods combined with Shape's methods.
Then the Shapes.prototype is further down the chain`,
  `c: Circle < Circle.prototype + Shape < Shape.prototype < {}.__proto__`
);
// If this is not the desired behavior then we can do the next way

// reset to original
Circle.prototype = initialCirclePrototype


// WAY #3.1 almost GOOD
// the key difference is that we are creating an object
// which uses the Shape.prototype as its __proto__ instead
objectHavingShapeAsProto = new Shape.prototype();
// or equivalently:
objectHavingShapeAsProto = Object.create(Shape.prototype);
// and we assign it to the Circle.prototype, this means that 
// Circle.prototype is an object having Shape.prototype as its __proto__
Circle.prototype = objectHavingShapeAsProto;
// now c < Circle.prototype < Shape.prototype < {}.__proto__
c = new Circle(12);
console.log(`third test run`);
for (let test of properPrototypeChainTests) {
  console.log(test, test(c)); // true, false, true, true, true
}
// failed test is the Circle.prototype.circleBaseMethod method
console.log(`we still trashed "circleBaseMethod" method`);


// reset to original
Circle.prototype = initialCirclePrototype

// WAY #2.2 completed GOOD
Circle.prototype = Object.create(Shape.prototype);
// We can fix the missing circleBaseMethod method by doing:
// in practice we define the circle prototype methods
// after reassigning it to the parent prototype
Circle.prototype.circleBaseMethod = initialCirclePrototype.circleBaseMethod;

c = new Circle(12);
console.log(`thrid test run`);
for (let test of properPrototypeChainTests) {
  console.log(test, test(c)); // true, true, true, true, true
}

// The proper way to go is to:
// 1. Define the Parent class
// 2. Define the Parent prototype methods
// 3. Define the Child class
// 4. reset the Child.prototype = Object.create(Parent.prototype)
