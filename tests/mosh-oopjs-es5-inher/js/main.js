// Inheritance

// Imagine that Circle is a class (not an object)

// Circle
//    computeOptimalLocation()

// And we have a Square that needs the computeOptimalLocation() method

// Square
//    computeOptimalLocation()

// You dont want to be copying the method in more than one place. There must be a way to have a single implementation, and any fix to the implementation should be done in one place and all the users of that method should get the fix update.

// That is where inheritance comes. We create a class that contains the implementation and other classes will inherit from it. For example lets create a class Shape and make Circle and Square inherit from it.

// Shape (Base/Super/Parent class)
// | computeOptimalLocatoin()
// |
// ---Square (Derived/Sub/Child class)
// |
// ---Circle (Derived/Sub/Child class)

// So we say: Circle is a Shape. Or Square is a Shape
// This is the classical definition of inheritance. But
// in javascript there is no such thing as Classes, we
// only have Objects

// Inheritance
// Classical vs. Prototypical inheritance

// Prototypical Inheritance
// Circle and Shape were classes, but in javascript there are only objects,

// How can we implement inheritance using only objects?
// We can create a shape object which implements the computeOptimalLocation()
// method, and somehow link the shape to the circle. By doing so,
// the shape becomes the prototype of the circle.

// Every object (except one) in javascript has a prototype or parent
// Whenever you hear prototype, just think of parent

let x = {a:1};
console.log(x);

// See that when you inspect x, there is a property called __proto__
// it is a bit faded because you should not access it (it is deprecated). 
// It is just here for debugging purposes.
// This __proto__ has a few properties, for example:
// Every object has a constructor.
// __proto__ has a few properties
console.log(x.__proto__.toString());
console.log(x.__proto__.valueOf());
// but we shouldn't access __proto__ so lets see if we can somehow
// access the proto methods from x directly like:
console.log(x.toString()); //we can but see the output
console.log(x.valueOf());
// What is interesting here is that the output of valueOf() is different
// if we call it from the __proto__ than if we call it from the x object directly
// This is a sign that inheritance is happening, because valueOf() is defined
// to return all the ownProperties of the object, when we call it from the
// __proto__ it will return the __proto__'s properties, and when called from
// x it will return the x object properties.

// The allowed way to access the prototype of an object is not with __proto__.
// Instead of __proto_ we have to use Object.getPrototypeOf(x);
console.log(Object.getPrototypeOf(x));
// But since all (except one) objects have a prototype, does __proto__ have a prototype?
console.log('__proto__' in x); // true
console.log('__proto__' in x.__proto__); // true
console.log(x.__proto__.hasOwnProperty('__proto__')); // true
// So it seems that __proto__ also has a __proto__, this means that there is
// an infinite chain of __proto__s, and if that were true, since it is an object,
// we would need infinite space to store all those objects. There is one possible
// explanation, that would avoid needing infinite space:
// - Is it that the __proto__ of __proto__ are both references to the same object (itself)?
let y = {}, z = {};
console.log('are y and z the same object?: ', y === z); // false
let yProto = Object.getPrototypeOf(y);
let zProto = Object.getPrototypeOf(z);
console.log('do y and z have the same proto?: ', yProto === zProto); // true
let yProtosProto = Object.getPrototypeOf(yProto);
let yProtos__proto__ = yProto.__proto__;
console.log('is proto of proto, proto itself?', yProto === yProtosProto); // false !! weird!
console.log('is __proto__ of proto, proto itself?', yProto === yProtos__proto__); // false !! weird!
// How come the proto of proto is not proto itself. When do we arrive at the base object???
console.log('typeof yProto: ', typeof yProto);
console.log(yProto);
console.log('typeof yProtosProto: ', typeof yProtosProto);
console.log(yProtosProto); // null! Null is of type object..
console.log(yProtos__proto__); // still null! Object.getPrototypeOf and x.__proto__ are equivalent
let objectBase = Object.getPrototypeOf({}); // the parent/prototype of all objects (except itself)
// Object.getPrototypeOf(yProtosProto); // TypeError: Cannot convert undefined or null to object
// So yProto and zProto do not have a proto, meaning that yProto and zProto must be the legendary baseObject: the parent of all objects, which has no prototype.
// IMPORTANT : In the developer tools console object inspector, it seems as though
// the prototype chain is infinite. This must be a feature of the inspector which
// creates a fake self prototype for the base object (to be verified, speculation)
// Maybe using the Object.defineProperty(this, '__proto__', func...)

// Let's inspect an array's prototype
let arrayBase = Object.getPrototypeOf([]);
let arrayBaseProto = Object.getPrototypeOf(arrayBase);
console.log('an array prototype: ', arrayBase);
console.log(`is array prototype' prototype, the base object?`, arrayBase === objectBase);

// So our inheritance for an array looks like this: 
//    myArray -> arrayBase -> objectBase
// This is called multilevel inheritance
// It happens for every object in javascript: Arrays, Strings, custom etc.

// Every object created from the Array() (or []) constructor, will inherit from arrayBase
// Similarly, every object created from the String() (or "") constructor will inherit
// from baseString
let stringBase = Object.getPrototypeOf("hello");
console.log(`stringBase the string's prototype: `, stringBase); // String {"", constructor: f, ...}
console.log(`stringBase's prototype is objectBase?`, Object.getPrototypeOf(stringBase) === objectBase); //true

// What happens for custom objects? Objects whose constructors we have coded.
function Circle(radius) {
  this.raidus = radius;

  this.draw = function() {
    console.log('draw');
  }
}

let c = new Circle(2);
let cBase = Object.getPrototypeOf(c);
console.log(`c's prototype`, cBase);
console.log(`c's prototype own property names`, Object.getOwnPropertyNames(cBase)); // ["constructor"]
// Object.keys() is like Object.getOwnPropertyNames() but only returns enumerable ones
console.log(`c's prototype own ENUMERABLE property names`, Object.keys(cBase)); // []
// The above empty array means that the only own property: "constructor" 
// has been defined as non enumerable, we can quickly change that via:
Object.defineProperties(cBase, {constructor: {enumerable: true,},});
// Now Object.keys() returns exactly the same as Object.getOwnPropertyNames()
console.log(`c's prototype own ENUMERABLE property names`, Object.keys(cBase)); // ["constructor"]
console.log(`is the Circle function the prototype?`, cBase === Circle); // false!
console.log(`Circle function`, Circle); // a function
console.log(`c's prototype has a property called "constructor". Is it the Circle function?`);
console.log(cBase.constructor === Circle); // true!
// So c's prototype has a reference to c's constructor.
// If you want to enumerate all the properties of cBase, they need to be ENUMERABLE
// and "constructor" is not enumerable, neither is "__proto__"
// But cBase has only two properties (both non-enumerable):
// - constructor
// - __proto__
// And we can again check that the __proto__ of cBase is the main objectBase
console.log(`All objects lead at some point in the inheritance chain to objectBase`, Object.getPrototypeOf(cBase) === objectBase);// true
let c2 = new Circle(13);
let c2Base = Object.getPrototypeOf(c2);
console.log(`all objects constructed from the same function have the same prototype?`, cBase === c2Base); // true
// When we call
let a1 = ['a']; // we are actually doing: let a1 = new Array('a')
// which you can see is constructing an array from the Array constructor function. So
// all arrays have the same constructor, hence the same prototype

// Property Descriptors
let person = {name: "John"};
console.log(`objectBase.toString() method, can be called from person`, person.toString());
let toStringDescriptor = Object.getOwnPropertyDescriptor(objectBase, "toString");

console.log('objectBase.toString() descriptor: ', toStringDescriptor); // see line below
// prints the descriptor object
// these descriptor attributes determine a few things you can do to a property of an object
// each property has these descriptors
// {
//   value: false, // (undefined) the value associated with the prop, any type
//   writable: true, // (false) can overwrite: ob.toString = 'hello'
//   enumerable: false, // (false) is returned in Object.getOwnPropertyNames(ob),
//                      // but is not returned in a "for in" or Object.keys(ob)
//   configurable: true, // (false) can do: delete ob.toString
// }
// (by default all property descriptor attributes are set to false 
// and undefined when using the Object.defineProperty(ob, "propHello", {value: 'hi'}) method.

// BUT when doing a normal property addition through: ob.hello = "my value",
// all the descriptor attributes are set to true and the value to the value.


console.log(`being able to call a property does not mean it is enumerable`, toStringDescriptor.enumerable === false); // enumerable means it is listed by Object.keys() and "for in"

// IMPORTANT: terminology. A "key" is an "enumerable own property". 
// An "own property" is any member of an object without considering the prototype chain. 
// The enumerability depends on the object "property descriptor": "enumerable.

// we can get all "keys" (aka ENUMERABLE own properties) with Object.keys
let personEnumerableProperties = Object.keys(person);
//  "for in" is another way to get ENUMERABLE properties (own + prototypes) of an object is :
let personEnumerableProperties2 = [];
for (let k in person) {
  personEnumerableProperties2.push(k);
}
// both return the same
console.log(personEnumerableProperties); // will only print 'name'
console.log(personEnumerableProperties2); // will only print 'name'

// IMPORTANT the "in" operator has different meaning when used alone like below:
console.log(`toString is not enumerable but computes to true with the "in" operator`, "toString" in Object.keys(person)); // true
// Why?? Because the "in" operator checks for the property in the whole
// prototype chain, and does not care for enumerability.

//--------
// SUMMARY:
//            | own                        | prototype chain 
// -------------------------------------------------------------
// enumerable | in, gOPN(), for-in, keys() | in, for-in, keys()
// -------------------------------------------------------------
// non-enumer | in, gOPN()                 | in
// -------------------------------------------------------------
//
// "in" : checks properties in the whole prototype chain (enumerable or not)
// "Object.getOwnPropertyNames(my)" : check for "own properties" (enumerable or not)
//     properites in the current object without looking up the prototype chain
// "Object.keys(my)" and "for in" : checks for "enumerable properties (own + prototype)"

// "Object.getOwnPropertyDescriptor(my, 'myprop')" gets the descriptor for a
//     given property (here "myprop") of object "my"
// "Object.defineProperty(my, 'myprop', {
//   value: 'hello',
//   writable: true,
//   enumerable: true,
//   configurable: true
//   })" is equivalent to my.myprop = 'hello'


// Constructor Prototypes
// Every object except the baseObject has a prototype object.
Object.getPrototypeOf(person); // <=> person.__proto__ (deprecated)

// You know that each object has properties inherited from its respective
// __proto__. Functions are objects whose __proto__ is f () {[native code]}
// this native code ends up generating some javascript object with a few
// nice properties
let helloFunc = function () {
  console.log('hello');
};
console.log(`a simple function object`, helloFunc);
console.log(`list of properties of a function object`, Object.getOwnPropertyNames(helloFunc));
// ["length", "name", "arguments", "caller", "prototype"]

// Every Constructor is a function, and since all functions have a property named: "prototype",
// every constructor function has a property named "prototype"
// remember that {} <=> new Object(), so Object is the constructor for any object
// therefore, it is a function, and it must have a property named "prototype"
// which should be equal to {}.__proto__
console.log(Object.prototype);
console.log({}.__proto__);
console.log(Object.prototype === {}.__proto__);

console.log(Array.prototype);
console.log([].__proto__);
console.log(Array.prototype === [].__proto__);

console.log(
  `therefore the Circle Constructor function must have a prototype property (!= __proto__)`,
  "prototype" in Circle // true
);
console.log(
  `but the objects that Constructors instantiate don't`,
  "prototype" in c // false
);
// ----- KEY PART 
console.log(
  `Circle.prototype is what will be used as the __proto__ object
for the instantiated object`, 
  Circle.prototype === Object.getPrototypeOf(c) // true
);
// -----
console.log(
  `we did not explicitely set Circle.prototype so for the moment it is:`,
  Circle.prototype // {constructor: f}
);
console.log(
  `which is simply an object with the "constructor" enumerable property`,
  Object.getOwnPropertyNames(Circle.prototype), // ['constructor']
  `and the __proto_ non enumerable one`, 
  "__proto__" in Circle.prototype // true
);



// Prototype vs Instance members
function Circle12(radius) {
  this.radius = radius;
  this.draw = function () {
    console.log('draw');
  };
}
const c121 = new Circle12(99);
const c122 = new Circle12(71);

// When creating a new object, all own properties
// will be added to a dedicated space in memory,
// which is unique to that object. 
// with each new object, a new space is used for its
// own properties.
// It makes sense so we can have different radius for 
// different circles. But that also means that in the 
// example above, "this.draw()" will be reated for every
// object that is created with the Circle12 constructor.
// In OOP langauges, methods belong to classes, therefore
// all objects in a class use methods from a shared
// space in memory (reserved for the class).
// HOWEVER in Javascript if we declare the method using 
// the "this" operator, it will be an own property: the
// method memory will not be shared among objects from the same
// constructor; for each object a new space in memory is created,
// so the method ends up being duplicated as many times
// as there are objects.
console.log(
  `Own properties are instance specific space in memory`,
  Object.getOwnPropertyNames(c121),
  Object.getOwnPropertyNames(c122),
  `draw() is returned as own property therefore it is duplicated in memory`
);
// SOLUTION: use the prototype to store methods. This will
// effectively serve as a "class". We can access properties
// from the prototype chain, directly from a child.
// HOW:
console.log(`is Circle.prototype writable?`, Object.getOwnPropertyDescriptor(Circle, "prototype").writable);
// GOOD WAY:
Circle12.prototype.draw2 = function() {
  console.log(this.radius); // works because this.radius is PUBLIC
};
const c123 = new Circle12(23);
console.log(c123.draw2()); // 23
// works, and even the this.radius references properly the object c123's property

// WRONG WAY ---- :
// Can we override it?
Circle12.prototype = new (function() {
  this.draw3 = function () {
    console.log(this.radius*3);
  }
});
const c124 = new Circle12(13);
console.log(c124.draw3()); // 39, exactly what is expected
// yes we can override it, and it works 
// BUT we LOOSE any property that was present in the prototype object
// it actually gets moved one level deeper in the chain. Instead of
// belonging to the c124.__proto__, the constructor is moved up to
// c124.__proto__.__proto__, which is not much of a deal, but since it
// The REAL PROBLEM is that once we do this, we are actually changing
// the prototype object itself, meaning that any object created previously
// will point to the old prototype object, and any new object created
// with the updatd Circle12.prototype will point to the new prototype
// This will actually make two separate families of objects with diff protos
// ---- END of WRONG WAY

// Instance members vs Prototype members
// We can easily override the toString() property
Circle12.prototype.toString = function() {
  return `Circle with radius ${this.radius}`
};
// there is no restriction on referencing prototype properties
// from the object itself, or even referencing child properties
// from the prototype

// IMPORTANT if we do it the GOOD way, then it does not make any 
// difference to change prototype's members after construction of
// objects has already taken palce. Since the prototype
// is an object and any already created child will still have a
// reference to the prototype object, no matter what changes were
// made to its props.
console.log(
  `c124 does not have own property "hello": `,
  c124.hasOwnProperty('hello') // false
);
Circle12.prototype.hello = 123;
console.log(`Lets add "hello" property to Circle12.prototype after c124 has already been created`);
console.log(
  `c124 has property "hello"`,
  'hello' in c124 // true
);

// WARNING :
// Avoid altering the builtin objects even by adding additional methods to their prototypes
// BAAAADDD:
Array.prototype.shuffle = function () {
  console.log('Shuffleing');
}
// BAAADDD continued
[].shuffle();
// Seems cool but, some one else in another library may have also modified the
// builtin objects and therefore you will end up pulling your hairs trying to
// figure out what it is that is creating issues in your code...

//-----------------------------------------------
// KEY TAKEOUT : DONT MODIFY OBJECTS YOU DON'T OWN
// ----------------------------------------------

