// ES6 inheritance with classes

class Shape {
  move() {
    console.log('move');
  }
}

class Circle extends Shape {
  draw() {
    console.log('draw');
  }
}

const c = new Circle(); // amazing, we no longer need to
// mingle with prototype and the prototype constructor in
// order to do proper inheritance

// Now lets create a more interesting example
// Lets say we want to have a width for every shape

class ShapeBis {
  constructor(width) {
    this.width = width;
  }

  move() {
    console.log('move');
  }
}

class CircleBis extends ShapeBis {
  // we are not required to have a constructor
  // if we are not adding any constructor
  // functionality
  draw() {
    console.log('draw');
  }
}

const cb = new CircleBis();
console.log(cb); // CircleBis {width: undefined}
const cb2 = new CircleBis(23);
console.log(cb2); // CircleBis {width: 23}

class CircleTris extends ShapeBis {
  constructor(width, other) {
    // if we do add a constructor to the child
    // but we don't call super() from within the child
    // constructor, then we get a Uncaught Reference error
    // 'Must call super constructor in derived class
    // bofore accessing 'this' or returning from derived
    // constructor'
    // so to avoid Ref error we do:
    super(width); // removes the Ref Error

    // now that super() was called we can start using
    // the 'this' keyword from within the derived constructor:
    // NOTICE that we are using the this.width which is
    // actuall set inside the parent's constructor
    this.area = 2*Math.PI*Math.pow(this.width/2, 2);

    this.somethingElse = other;
  }

  draw() {
    console.log('draw');
  }
}

const ct = new CircleTris();
console.log(ct); // CircleBis {width: undefined}
const ct2 = new CircleTris(23, 'hey');
console.log(ct2); // CircleBis {width: 23, area: 830.951, somethingElse: 'hey'}
console.log(ct2.area);


// --------------------------------------------------
// Method Overriding

class CircleFroth extends ShapeBis {
  // We can easily override a parent method by
  // defining it again inside the child
  move() {
    super.move(); // we can (but are not required) call the parent move
    console.log('circles move and do more stuff');
  }
}

const cf = new CircleFroth(12);

// Why does this work?
cf.move();
// BECAUSE remember that methods declared outside of the
// class constructor, are actually set on the prototype
// So in the above code, the move() method in the child class
// is actually in the cf.__proto__.move(), and since
// it is a child class, cf.__proto__ has a __proto too:
// cf.__proto__.__proto__.move() is the parent move method
// Everything works perfectly

