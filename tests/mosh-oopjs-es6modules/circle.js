const _priv = new WeakMap();

export class Circle {
  constructor(radius) {
    _priv.set(this, {});

    _priv.get(this).radius = radius;
  }

  draw() {
    console.log(`Circle with radius ${_priv.get(this).radius}`);
  }
}
