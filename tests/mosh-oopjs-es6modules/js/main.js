// 1. Modules

// Modules are good because they allow:

// Maintainability
// Reuse
// Abstraction : for example when using WeakMap, modules allow to hide the const

// How to use modules?

// In ES5
// Module definition types:
//
// 1. AMD (Asynchronous Module Definition) : used in Browser
// 2. CommonJs : used in Node.js
// 3. UMD (Universal module definition): used in Browser / Node.js
//
// In ES6
// 4. ES6 Modules : used in Browser


// We will only cover:
// 2. CommonJs for Node.js
// 4. ES6 Modules for Browser

// THere is no need for the other two unless you are maintaining a legacy lib

// NodeJs--------------------------------------------------
// 2. CommonJs Modules which are used in Node.js
// Everything you define in a module is considered to be private
// To create a module you should move code to a separate file.js
// Place the code, and then at the end you should call:
// module.exports.Circle = Circle;
// module.exports.Square = Square;
//
// or if you export a single thing you can do:
//
// module.exports = Circle;

// If inside the module file, we only export the Circle, then 
// from within the importing file at the top do:
//
// const Circle = require('./circle');
//
// This has the benefit of hiding everything else
// so we have abstraction in practice


// Browser--------------------------------------------------
// 4. ES6 Modules
// Create a file ./circle.js
// add the Circle class code by prefixing it with 'export'
// Then to import the module do :
import {Circle} from './circle';

// IMPORTANT the code above will throw a : 
// SyntaxError: Unexpected token {

// There is a PROPER WAY to fix this issue using WebPack

// But here we will use a workaround which consists of
// adding a type="module" to the <script tag see index.html
// This will make the browser treat main.js as a module
// and by treating main.js as a module, it can understand
// the {Circle} expression

// If we reload we stil get a HTTP GET error
// becausee the browser is trying to GET ./cirlce instead of ./circle.js
// So if we change the code to:
//
// import {Circle} from './circle.js'
//
// Then it should work


// --------------------------------------------------
// ES6 TOOLING
//
// Transplier : Translator + Compiler
// Converts Modern ES6 (through BABEL) to ES5 that all browsers understand

// Bundler
// Combines all javascript files into a single file (through WEBPACK)
// and uglifies the code

// --------------------------------------------------
// BABEL
// In order to use BABEL we need Node.js
//
// Once we have node installed,
// We create a project folder

// Then we need to initialize a node project in the folder:
//
// >npm init --yes
//
// This will create a file named package.json in the project folder
//
// package.json:
// Is an identification of our application
//
// Now we need to install Babel in the project
//
// >npm i babel-cli@6.26.0 babel-core@6.26.0 babel-preset@1.6.1
//
// Where:
//   babel-cli: is the command with which we interact. We will 
//   pass our js files and babel-cli will send it to babel-core
//   for transpilation to the correct js
//
//   babel-core: is the core of babel handling the transpilation
//
//   babel-preset-env: is a combination of all the plugins, so we
//   don't have to worry that we have imported the correct plugin
//   for the specific ES6 functionality
//
//   --save-dev: tells babel that all these will be used in the
//   development environment and should not be deployed to production


// Now once we have created some code inside main.js withing the 
// project folder we can edit package.json

// package.json
{
  "name": "my-proj-name",
  //...
  "scripts": {
    "babel": "babel --presets env main.js -o build/main.js"
  },
  //..
}

// This tells babel to transpile main.js and save it into the build/ folder
// so make sure to have created a ./build folder within the proejct directory

// Now from the terminal within the project dir, we do:
//
// >npm run babel
//
// This will run the command keyed 'babel' inside the package.json "scripts"


// WARNING this will only transpile a single file named main.js, but
// in a real world application we have thousands of files
// SO HOW DO WE TRANSPILE ALL FILES?
// By using Webpack

// --------------------------------------------------
// WEBPACK
// Installing webpack globally so we can use it in every project
//
// >npm i -g webpack-cli@2.0.14


// Now within our project folder we need to init Webpack
//
// >webpack-cli init
//
// It will ask you a few question, like 
//
// 'using many bundles?' say No
// 'which module will be the first to enter the application?' [ex: ./src/index]
//    you should move index.js into a folder named src
// 'which folder will your generated bundles be in? [def: dist]' accept
// 'Are you going to use this in production? say No'
// 'Will you be using ES2015?' say Yes -> this will automatically install babel to
//    transpaile our code into ES5

// This is the cool thing about Webpack-cli: it will help generate the conf files
// and also install all the other libraries and tools that we need
//

// Let's modify package.json to take make full use of webpack
// Notice that webpack-cli has added "dependencies" in it
// they are dev dependencies so they should be probably stored
// inside devDependencies, but this will probably change in future
// versions
// package.json
{
  "name": "my-proj-name",
  //...
  "scripts": {
    "build": "webpack"
  },
  //..
}

// Now let's bundle our application:
//
// >npm run build

// See that webpack created a bundle named './build/main.bundle.js'

// This is the file we will be serving in index.html
// So we need to change the file we request:
//
// <script src="dist/main.bundle.js"></script>


// IMPORTANT : To avoid having to call 'npm run build' every time
// we make a change to a js file, we can alter a slightly bit 
// our package.json and add the -w option:

{
  "name": "my-proj-name",
  //...
  "scripts": {
    "build": "webpack -w"
  },
  //..
}

// This will make webpack watch our files for any changes and rebuild
// after any change is saved


// NOTE that now that we are using a bundle we can simply import
// without having to specify the .js
// This:
//
// import {Circle} from './circle.js'
//
// Can become this:
//
// import {Circle} from './circle.js'
