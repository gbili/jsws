'use strict'

function Person(name) {
  this.name = name;
}

Person.prototype.isArrowThisClear = function () {
  const isThisClear = {
    yes: () => this.name,
  };
  return isThisClear;
}

Person.prototype.isFunctionThisClear = function () {
  const isThisClear = {
    yes: function () { return this.name },
  };
  return isThisClear;
}

const bob = new Person('Bob');

const amir = {
  name: "Amir",
};

const amirWithSurname = {
  name: "Amir Aiouaz",
};


const isItArrowClear = bob.isArrowThisClear();
// copying an function property that will retain scope from its definition
// whose this will not be checked at call time, using it from scope
const arrowDefinitionKeepScope = isItArrowClear.yes;
amir.getName = arrowDefinitionKeepScope;

// if it retained scope it should output bob.name
// else error: accessing name on undefined
console.log(amir.getName());

const isItFunctionClear = bob.isFunctionThisClear();
// copying an function property that will not retain scope from its definition
// and whose this will be reallocated at call time to what is before the dot
const functionDefinitionUsesDotScope = isItFunctionClear.yes;
amirWithSurname.getName = functionDefinitionUsesDotScope;

// using what?
console.log(amirWithSurname.getName());