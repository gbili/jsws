const _priv = new WeakMap();
class Stack {
  constructor() {
    _priv.set(this, {});
    _priv.get(this).stack = [];
  }

  get count() {
    return _priv.get(this).stack.length;
  }

  push(el) {
    _priv.get(this).stack.push(el);
  }

  pop() {
    if (this.count <= 0) throw new Error('Stack is empty');
    return _priv.get(this).stack.splice(this.count - 1, 1)[0];
  }

  peek() {
    if (this.count <= 0) throw new Error('Stack is empty');
    return _priv.get(this).stack[this.count-1];
  }
}

const s = new Stack();

console.log(s.count);
s.push(1);
s.push(2);
console.log(s.count);
s.push(3);
console.log(s.count);
console.log(s.peek());
s.push(4);
console.log(s.peek());
console.log(s.pop());
console.log(s.peek());
console.log(s.count);
console.log(s.pop());
console.log(s.count);
console.log(s.pop());
console.log(s.count);
console.log(s.pop());
console.log(s.count);
console.log(s.pop());
console.log(s.count);

// WORKS!
