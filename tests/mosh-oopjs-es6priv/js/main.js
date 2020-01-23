// 5. Private Members Using Symbols
// The point of having private members is to
// enforce Abstraction, which states that objects
// should expose only the workable interface
// Remember the DVD player only shows the play pause buttons

// Symbol() function returns a value of type 'symbol'
// The Symbol() function has static properties that can
// query the global symbols registry. The Symbol function
// resembles a built-in object class but is incomplete as
// a constructor because it does not support 'new' operator

// Every symbol value returned by Symbol() is unique
// symbol data type values's sole purpose is to be 
// used as object property identifiers.
// Symbol('foo') !== Symbol('foo') // true

const _radiusSym = Symbol(); // a unique symbol
const _myMethodSym = Symbol();

class Circle {
  constructor(radius) {
    // instead of using these publicly accessible props
    this.radius = radius;
    this['radius'] = radius;
    // conventional privacy which is BAD
    this._radius = radius; // BAD publicly accessible and modifiable
    // we can use symbols to 'fake' privacy by limiting accessibility
    this[_radiusSym] = radius; // will not appear on iteration
  }

  [_myMethodSym]() {
    console.log('using bracket notation to declare a method using a symbol');
  }
}

const c = new Circle(11);
c.radius; // accessible so not private
c._radius; // also accessible so not private, relies on convention
// The symbol will not show up in
Object.getOwnPropertyNames(c); // ['radius', '_radius'] // there is no Symbol
// We can still see the symbol in console.log but we cannot access it
console.log(c); // Circle {radius: 11, _radius:11, Symbol(): 11}
// except with this hack
const mySymProps = Object.getOwnPropertySymbols(c);
console.log(mySymProps); // [Symbol()]
console.log(c[mySymProps[0]]); // 11
// but this should not be used outside of a reflection library

// Why don't we see the _myMethodSym in the 
// symbols properties list of the object?
// REMEMBER : methods defined in the body of the class are
// actually defined in the PROTOTYPE!!
const myPrototypeSymProps = Object.getOwnPropertySymbols(Object.getPrototypeOf(c));
console.log(myPrototypeSymProps); // [Symbol()]
console.log(c[myPrototypeSymProps[0]]); // f [_myMethodSym] { console .... }


//---------------------------------------------------
// 6. Private Members using WeakMaps

// We want to turn the radius property into a private property

// WeakMaps are named like so, becuase the keys are weak,
// meaning that if there are no references to the objects
// used as keys, then the entries for those keys in the map
// are deleted

// You can already see that we can create a weakmap for which
// we use 'this' as key and map some value
const myObj = {hi:1};
const myFunc = function() {};
const myWM = new WeakMap();
myWM.set(myObj, 'some value'); // any value
myWM.set(myFunc, {h:[1,2,], f: function() {},}); // any value
// myWM.set(1, {}); BAD -> only objects as keys otherwise can never garbage collect
const aNumberObject = new Number('123'); // aNumberObject !== 123
myWM.set(aNumberObject, 123); // works because aNumberObject is not the number 123, 
//aNumberObject it's an object
// When the object is deleted, so does the weakmap key
const _radius = new WeakMap();
const _myBadMeth = new WeakMap();
const _myOkMeth = new WeakMap();

class Square {
  constructor(radius) {
    // we can easily access _radius.get(this) to retrieve the radius
    // from within this class. But from the outside, if there is no reference
    // to const _radius, then it becomes inaccessible
    _radius.set(this, radius);

    // potentially BAD
    _myBadMeth.set(this, function(){
      return this;
    });

    // if called here it is also BAD, because 'this' inside the called function
    // references undefined because the function is not called with 'new'
    // nor called with the dot obj.func(), so 'this' is undefined due to 'strict mode'
    // enforced in classes. If we used < ES6 classes syntax, 'this' would reference
    // the global object instead of undefined if no strict mode was enforced
    console.log('myBadMeth inside constructor', _myBadMeth.get(this)());

    // Solution is to use ARROW FUNCTIONS which
    // have the particularity of using the 'this' value
    // of the enclosing function (here the enclosing is
    // the constructor function
    _myOkMeth.set(this, () => {
      return this;
    });
    console.log('myOkMeth inside constructor', _myOkMeth.get(this)());
  }

  draw() {
    // OK
    console.log(_radius.get(this)); // 13 works

    // BAD at call time, we will be able to get the method stored
    // in the weakmap in constructor, but we will get an undefined
    // when called, because in console.log(this), the 'this' is undefined
    // REMEBER the rule, 'this' has the proper value on construction with 'new'
    // and when the method is called on the object like: obj.meth()
    console.log('myBadMeth outside constr', _myBadMeth.get(this)());
    // here we are getting the function
    let funcWithAThisInside = _myBadMeth.get(this);
    // then we call it lonely
    funcWithAThisInside(); // 'this' is undefined

    // OK at call time, the arrow function will inherit the
    // enclosing function's 'this' reference (here the constructor)
    // so 'this' will reference this object
    console.log('myOkMeth outside constr', _myOkMeth.get(this)());
  }
}

// Technically we can access the private propery if you have a reference to _radius
// but we can hide the reference to const _radius by using modules and only
// exporting the class and not the variables of the module
const s = new Square(13);
s.draw();

// Using a SINGLE WEAK MAP
// If we did not use distinct WeakMaps, we could only have a single entry
// in the WeakMap, so we should create an object to which we add all priv props
const _privWM = new WeakMap();
const _privProps = {};
class Hello {
  constructor(name, gender) {
    // Initialize the object used to store private properties
    _privWM.set(this, {});

    // let's store a few private props
    _privWM.get(this).name = name;

    _privWM.get(this).gender = gender;

    _privWM.get(this).myPrivMeth = () => {
      return this;
    };
  }

  sayIt() {
    // OK works
    console.log(`Hello ${_privWM.get(this).name}`, _privWM.get(this).myPrivMeth());
  }
}

// ALTERNATIVELY a seemingly cleaner way
// MAJOR DRAWBACK, forgetting to store the _props into the WeakMap
// USELESS?, since we have a reference to _props, the WeakMap advantage
// of garbage collecting the pairs whose key's reference is lost, 
// that is to say when the main object ref is killed we will not not have the
// benefit removing the object from memory?

const _privWm = new WeakMap();
const _props = {};

class HelloBis {
  constructor(name, gender) {
    // Initialize the object used to store private properties
    // tells that uses private properties
    _privWM.set(this, _props);

    // let's store a few private props
    _props.name = name;

    _props.gender = gender;

    _props.myPrivMeth = () => {
      return this;
    };
  }

  sayIt() {
    // OK works
    console.log(`Hello ${_props.name}`, _props.myPrivMeth())
  }
}

const h1 = new Hello('john', 'male');
h1.sayIt(); // Works perfectly
const h2 = new HelloBis('fanny', 'female');
h2.sayIt(); // Works perfectly


// 7. Getters and Setters

// OLD
const _priv = new WeakMap();
// Using Object.defineProperty(,,)
// and Shorhand Method Names
function VehicleOld(wheels) {
  _priv.set(this, {});
  // set a initial value from param
  _priv.get(this).wheels = wheels;
  // Using old syntax to define getters and setter for prop
  Object.defineProperty(this, 'wheels', {
    get: function() {
      return _priv.get(this).wheels;
    },
    set: function(number) { // when having a setter no need for 'writable'
      _priv.get(this).wheels = number;
    },
    enumerable: false,
    configurable: true,
  });
}
const vo = new VehicleOld(4);
console.log('initial vehicle', vo);
console.log('initial val should b 4:', vo.wheels); //4
vo.wheels = 2;
console.log('set wheels to 2, value should be 2:', vo.wheels); //2

// OLDISH
// Using Object.defineProperty(,,)
// and Shorhand Method Names
class VehicleSemiOld {
  constructor(wheels) {
    _priv.set(this, {});
    // set a initial value from param
    _priv.get(this).wheels = wheels;
    // Using new ES6 'shorhand method names' syntax
    Object.defineProperty(this, 'wheels', {
      get() { // shorhand method name
        return _priv.get(this).wheels;
      },
      set(number) { // shorhand method name
        _priv.get(this).wheels = number;
      },
      enumerable: false,
      configurable: true,
    });
  }
}
const vso = new VehicleSemiOld(6);
console.log('initial val should b 6:', vso.wheels); //4
vso.wheels = 2;
console.log('set wheels to 2, value should be 2:', vso.wheels); //2

// Of course these two examples above could have been achieved by
// a simple this.wheels in the constructor, except that here
// we have set the 'enumerable' to false, which would not be the case
// for a simple this.wheels

// Getters and Setters with ES6 syntax
// ES6 has much less convoluted syntax than above, see below

//const _priv = new WeakMap(); // already created above

class VehicleES6 {
  constructor(number) {
    // create a reference for this object's private props
    _priv.set(this, {});
    _priv.get(this).wheels = number;
  }

  get wheels() { // ES6 getter
    return _priv.get(this).wheels;
  }
  set wheels(number) { // ES6 setter 
    if (number <= 0) throw new Error('Flying vehicles are not allowed');
    _priv.get(this).wheels = number;
  }
}

const vn = new VehicleES6(8);
console.log('initial val should b 8:', vn.wheels); //8
vn.wheels = 1;
console.log('set wheels to 1, value should be 1:', vn.wheels); //1
