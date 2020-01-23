function HtmlElement() {
  this.click = function() {
    console.log('clicked');
  };
}

HtmlElement.prototype.focus = function() {
  console.log('focus');
};

const e = new HtmlElement();

function HtmlSelectElement(...els) {
  this.items = els;
  this.addItem = function(item) {
    if (false !== this.items.indexOf(item)) {
      this.items.push(item);
    }
  };

  this.removeItem = function(item) {
    let index = this.items.indexOf(item);
    if (index !== false) {
      this.items.splice(index, 1);
    }
  };

  this.render = function() {
    return `
<select>${this.items.reduce((acc, it) => acc + `
  <option>${it}</option>`, '')}
</select>`;
  };
}

HtmlSelectElement.prototype = new HtmlElement();
// we still need to reset the constructor
HtmlSelectElement.prototype.constructor = HtmlSelectElement;

const s = new HtmlSelectElement(1,2,3);

function HtmlImgElement(src) {
  this.src = src;
  this.render = function() {
    return `<img src="${this.src}" />`;
  };
}

HtmlImgElement.prototype = new HtmlElement();
HtmlImgElement.prototype.constructor = HtmlImgElement;

const i = new HtmlImgElement('http://hello.com');

for (let el of [s, i]) {
  console.log(el.render());
}
