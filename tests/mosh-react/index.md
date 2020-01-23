# What is React

## Components

At the heart of every react application are Components.
A component is a piece of a user interface UI. So when you are building applications with react, you are basically building independent isolated and reusable components and then compose them to create user interface.

Every react application is basically a tree of react components.

```
App >
|_>Navbar
|_>Profile
|_>Trends
|_>Feed
    |_> Tweet
    |_> Like
```

All these are components which we can reuse on other pages. Or even different applications. So as you can see, React components are basically UI components that you can put together to build complex UI's.

In terms of implementation, a component is typically declared as a Class, that has some _state_, and a _render_ method.

```javascript
class Tweet {

  state = {};

  render() {

  }

}
```

The _state_ here is the data that we want to display when the component is rendered.
And the `render()` method is responsible for describing what the UI should look like. The output of the _render_ method is a _React Element_ which is a simple _plain javascript object_ that maps to a _DOM Element_ (this _DOM Element_ is not a real _DOM Element_, it is just a plain javascript object that represents that _DOM Element_ in memory.

To do so, React keeps a lightweight representation of the DOM in memory, that is called the **Virtual DOM**. Unlike the **Real DOM**, this **Virtual DOM** is cheap to create.

When we change the state of a _component_, we get a new **React Element**. React will then compare this **React Element** and its children to the previous one, and it figures out what has changed and then it will update a part of the **Real DOM** to keep it in _sync_ with the **Virtual DOM**.

This means that whenever we are building applications with React, unlike vanilla javascript or jQuery, 
> we no longer have to work with the DOM Api in browsers.

In other words we don't have to write code that interacts with the DOM Api like:

```javascript
const element = document.querySelector();
element.classList.add();
element.addEventListener();
```
or even attach event handlers to DOM elements.

> We simply change the state of our components, and react will automatically update the DOM to match that state.

That is where the name comes from: _React reacts to state changes_.

## React or Angular
Both React and Angular are similar in terms their _component based architecture_. However, Angular is a _Framework_ (or a complete solution), whereas React is a _Library_ : it only takes care of rendering the view, and makes sure that the view is in sync with the state. That is all react does. Nothing less, nothing more.

Because it is so focused, React has a very small API to learn. So when building applications with react, we need to use other libraries or things, like _routing_ or calling _http_ services and so on. This gives you the freedom to chose which other libraries to use React with. But with freedom comes responsibility. This is opposed to what Angular forces you to use, and often breaks from one version to another.

## Setting Up the Development Environement

1. Install Node.js
2. Install create-react-app
   ```
   $ npm i -g create-react-app@1.5.2
   ```
3. Install Extensions in your code editor for:   
   - Code snippets for react
   - Code formatter on save


## First React App

### Zero-Config Setup
Using `create-react-app` command we are going to create our first react app.

```
$ cd my-apps-dir
$ create-react-app my-reactapp
```

This is going to install React and all the third party libraries that we need such as:
- Development Server (a lightweight one)
- Webpack (for bundling our files)
- Babel
- as well as a bunch of other tools

So when you create an application using `create-react-app`, you don't have to do any configuration. All the configuration is done for you.

However if you want to customize this configuration for your production environement, you can always eject by running:
```
npm run eject
```
We will look at this later in the future.

### Launching the server
Now that we have created our React app. Let's got the the app folder, and launch the development server:
```
$ cd my-reactapp
$ npm start
```

### The app directory structure
```
- npm_modules
  - ...
- public
  - favicon.ico
  - index.html
  - manifest.json
- src
  - App.css
  - App.js
  - App.test.js
  - index.css
  - index.js
  - logo.svg
  - registerServiceWorker.js
- .gitignore
- package-lock.json
- package.json
- README.md
```

Let's have a look at `./src/App.js` component file:
```javascript
import React { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  render() {
    return {
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
      </div>
    };
  }
}
```

Have you noticed the extensive use of **JSX** in the render method?
This is not javascript, and only works because we use Babel to transpile JSX into plain javascript that uses the React API.

To remember that ES6 classes are syntactic sugar, let's transpile the class to ES5 for fun:

```javascript
// ... import using ES5

function App() {
}

App.prototype = Object.create(Component.prototype);

App.prototype.constructor = App;

App.prototype.render = function() {
   return React.createElement("div", { className: "App" }, 
    React.createElement("header", { className: "App-header" }, 
      React.createElement("img", { src: logo, className: "App-logo", alt: "logo" }), 
      React.createElement("h1", { className: "App-title" }, "Welcome to React")
    ), 
    React.createElement("p", { className: "App-intro" }, 
      "To get started, edit ", 
      React.createElement("code", null, 
        "src/App.js"
      ), 
      " and save to reload."
    )
  );
};

```
You can have a look at [Babeljs.io][http://babeljs.io/repl], there you can pass ES6 and JSX code and have it transpile it for you.
As you notice, using JSX is much simpler than having to write plain javascript using the React API. As we said, Babel is responsible for transalting JSX into plain js every time you save your files and the compilation is run.

### App.css
Notice also that we import `./App.css` which contains all the css for our component.

### App.test.js
Is a file where we test our component.

### index.js
Is our main Js file and you can see that we import our `App.js` file in there, and ask
```javascript
ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();
```
to render our app in the root DOM element of our application inside index.html file.

### index.css
Contains our general CSS

### logo.svg
Is the react logo used in our app

### registerServiceWorker.js
This is some code that is automatically generated by `create-react-app` command. It registers a service worker to serve asstes from a local cache, in production environements.

## Hello World!

Let's erase all the files in ./src folder and create a new one called ./src/index.js
```javascript
import React from 'react';
import ReactDOM from 'react-dom';

const element = <h1>Hello World</h1>;
console.log(element);
ReactDOM.render(element, document.getElementById('root'));
```

Babel will compile this JSX expression into a plain React.createElement('h1', ...);
That is why we have to import React on the top even if it appears to not be used in the code.
But when our code is compiled, it is efectively used. This element create by react is now part of the Virtual DOM (not yet part of the Real DOM). Whenever the state of this object changes, React will create a new React element, and compare it to the previous one. React will figure out what has changed and then React will reach out to the Real DOM and update it accordingly.

To make it part of the real DOM, we need to render it. To do so, we need to tell render what element to render, and as a second argument, where this element should be rendered in the real DOM. 
So lets have a look at public/index.html and see where we can attach it.

This is a very simple element, but in a real world application, we will render our App component, and that root App component will typically be composed of many child components which will change state.

## Custom Configs

Inside the application main folder, go to `package.json`:
```json
{
  "name": "mosh1",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "react": "^16.8.6",
    "react-dom": "^16.8.6",
    "react-scripts": "2.1.8"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ]
}
```
See the `scripts` entry? It contains all the `npm` commands that we can use to manage our applicaion.
- npm run start
  - to start our development webserver
- npm run build
  - to build our application for production
- npm run test
  - runs the test suite
- npm run eject
  - we can use this tool to eject from `create-react-app` and customize all the tools and configurations that come with this project.

One interesting thing here, is that in the `dependency` entry we only have 3 dependencies:
- react
  - which is the main react library
- react-dom
  - which is the part of react that interacts with the DOM
- react-scripts
  - which is another library that takes care of _starting_, _building_, _testing_ and _ejecting_ a `create-react-project`.

The interesting thing here is that under `dependencies` you don't see any references to tools like **Webpack**, **Babel** etc. this is the beauty of using a `create-react-project`; all that complexity is hidden. Now, if you `eject` from `create-react-app`, all those hidden dependencies that `craete-react-app` abstracts from us, will be put back in the `depenencies` entry of our app's `package.json` file.
To do so, you can type this in the terminal:
```
npm run eject
>This git repository has untracked files or uncommitted changes:

src/App.css
D src/App.js
D src/App.test.js
D src/index.css
M src/index.js
D src/logo.svg
D src/serviceWorker.js

Remove untracked files, stash or commit any changes, and try again.
npm ERR! code ELIFECYCLE
npm ERR! errno 1
npm ERR! mosh1@0.1.0 eject: `react-scripts eject`
npm ERR! Exit status 1
npm ERR! 
npm ERR! Failed at the mosh1@0.1.0 eject script.
npm ERR! This is probably not a problem with npm. There is likely additional logging output above.

npm ERR! A complete log of this run can be found in:
npm ERR!     /home/g/.npm/_logs/2019-04-10T10_48_04_126Z-debug.log
```
This error is self explanatory, and the reason we are having it, is because `create-react-app` initialized a `git` repository for us. So simply `git add . && git commit -m "matching mosh's code"` and run the `npm run eject` command again, and say _yes_ in the prompt.

Now if you go back to `package.json` the file will have changed and will list all those previously abstracted dependencies.

```json
{
  "name": "mosh1",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@babel/core": "7.2.2",
    "@svgr/webpack": "4.1.0",
    "babel-core": "7.0.0-bridge.0",
    "babel-eslint": "9.0.0",
    "babel-jest": "23.6.0",
    "babel-loader": "8.0.5",
    "babel-plugin-named-asset-import": "^0.3.1",
    "babel-preset-react-app": "^7.0.2",
    "bfj": "6.1.1",
    "case-sensitive-paths-webpack-plugin": "2.2.0",
    "css-loader": "1.0.0",
    "dotenv": "6.0.0",
    "dotenv-expand": "4.2.0",
    "eslint": "5.12.0",
    "eslint-config-react-app": "^3.0.8",
    "eslint-loader": "2.1.1",
    "eslint-plugin-flowtype": "2.50.1",
    "eslint-plugin-import": "2.14.0",
    "eslint-plugin-jsx-a11y": "6.1.2",
    "eslint-plugin-react": "7.12.4",
    "file-loader": "2.0.0",
    "fs-extra": "7.0.1",
    "html-webpack-plugin": "4.0.0-alpha.2",
    "identity-obj-proxy": "3.0.0",
    "jest": "23.6.0",
    "jest-pnp-resolver": "1.0.2",
    "jest-resolve": "23.6.0",
    "jest-watch-typeahead": "^0.2.1",
    "mini-css-extract-plugin": "0.5.0",
    "optimize-css-assets-webpack-plugin": "5.0.1",
    "pnp-webpack-plugin": "1.2.1",
    "postcss-flexbugs-fixes": "4.1.0",
    "postcss-loader": "3.0.0",
    "postcss-preset-env": "6.5.0",
    "postcss-safe-parser": "4.0.1",
    "react": "^16.8.6",
    "react-app-polyfill": "^0.2.2",
    "react-dev-utils": "^8.0.0",
    "react-dom": "^16.8.6",
    "resolve": "1.10.0",
    "sass-loader": "7.1.0",
    "style-loader": "0.23.1",
    "terser-webpack-plugin": "1.2.2",
    "url-loader": "1.1.2",
    "webpack": "4.28.3",
    "webpack-dev-server": "3.1.14",
    "webpack-manifest-plugin": "2.0.4",
    "workbox-webpack-plugin": "3.6.3"
  },
  "scripts": {
    "start": "node scripts/start.js",
    "build": "node scripts/build.js",
    "test": "node scripts/test.js"
  },
  "eslintConfig": {
    "extends": "react-app"
  },
  "browserslist": [
    ">0.2%",
    "not dead",
    "not ie <= 11",
    "not op_mini all"
  ],
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/**/*.d.ts"
    ],
    "resolver": "jest-pnp-resolver",
    "setupFiles": [
      "react-app-polyfill/jsdom"
    ],
    "testMatch": [
      "<rootDir>/src/**/__tests__/**/*.{js,jsx,ts,tsx}",
      "<rootDir>/src/**/?(*.)(spec|test).{js,jsx,ts,tsx}"
    ],
    "testEnvironment": "jsdom",
    "testURL": "http://localhost",
    "transform": {
      "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest",
      "^.+\\.css$": "<rootDir>/config/jest/cssTransform.js",
      "^(?!.*\\.(js|jsx|ts|tsx|css|json)$)": "<rootDir>/config/jest/fileTransform.js"
    },
    "transformIgnorePatterns": [
      "[/\\\\]node_modules[/\\\\].+\\.(js|jsx|ts|tsx)$",
      "^.+\\.module\\.(css|sass|scss)$"
    ],
    "moduleNameMapper": {
      "^react-native$": "react-native-web",
      "^.+\\.module\\.(css|sass|scss)$": "identity-obj-proxy"
    },
    "moduleFileExtensions": [
      "web.js",
      "js",
      "web.ts",
      "ts",
      "web.tsx",
      "tsx",
      "json",
      "web.jsx",
      "jsx",
      "node"
    ],
    "watchPlugins": [
      "/home/g/Documents/workspace/js/react/mosh1/node_modules/jest-watch-typeahead/filename.js",
      "/home/g/Documents/workspace/js/react/mosh1/node_modules/jest-watch-typeahead/testname.js"
    ]
  },
  "babel": {
    "presets": [
      "react-app"
    ]
  }
}
```

Apart from this, you will notice that a new `config` folder will have been created inside our app's main folder. It contains all the **Webpack** configurations for development and production environements. You could now open `webpack.config.dev.js` for example and make any tweaks.

### Conclusion
Use `eject` only if you know what you are doing.

## Full-stack Architecture
Every app or mobile app, has two parts that communicate over `HTTP` the:
1. Frontend
   - Runs on the Client, such as : the browser or phone
   - It is basically the UI
2. Backend
   - Runs on the Server
   - is where we store and process the data, send notifications, kick off workflows and so on. 

In this course we will only focus our attention on the _Frontend_ part of our application. But in a real world scenario, you would have to build the _Backend_ server too.

There are various frameworks and technologies for actually doing that:
- C# / ASP.NET
- Javascript / Node + Express
- No Code / Firebase
  - It's a Google service that allows you to couple your app with a backend for which very little code is required. It will handle the details for you. You simply create a Firebase account and connect a react app to it. It gets you up and running pretty quickly, but can get costly and it is not something that is adopted in most companies out there.
- PHP, Python, etc.

We will be using Node.js, because it is basically javascript, but won't delve into the details.

We will only learn how to talk to backends in a React app.

## Course Structure

1. Refresh Javascript
2. Components
   - Are the building blocks or react apps.
   - How to compose components
   - How to pass data to the component
   - How to have them interact with each other
3. Tables
   - How to build tables with
   - Pagination
   - Sorting
   - Searching
4. Forms
   - For data validation
5. Routing and Navigation
   - How to have multiple pages in an application
   - How to take the user from one page to another
6. HTTP Services
   - Calling Http services, 
   - How to talk to backend services
   - Before this section all data was stored in memory, but after it will be stored in the backend on a MongoDB
7. Auth
   - Authentication
   - Authorization
   - Will be using the backend Auth services (developped in the Node.js app). We will not be using Auth0 or Firebase services for authentication because in the real world companies prefere to manage it themselves. So we will know how to build custom Auth in react apps.
8. Deployment
  - At the end of this course we will have developed a real video rental application.

## Redux
Redux will not be covered in this course. The problem with learning Redux right from the get-go is that developers end up not understanding the core concepts of React. You can learn redux on a separate course.
Redux is a predictable state container for javascript apps.

## Javascript Core Required Concepts
- Let vs Const vs Const
  - `var` : hoists inside the function it is defined
  - `let` : accessible only inside the block in which they are defined
  - `const` : same as let, but does not allow reassignement, prefer `const` over `let`.
- Objects
  - Object in javascripts are collections of key:value pairs
  - In ES6, we can define methods without the `:` and `function` keyword
    ```javascript
    const person = {
      name: 'mosh',
      hello() { // notice no colon nor function keyword
      },
    };
    ```
  - To access properties we ca use _dot_ or _bracket notation_
    - Use _bracket notation_ when you don't know the name of the prop in advance
      ```javascript
      const myVarPropName = getContentFromUser();
      let someVal = myObj[myVarPropName];
      ```
    - If you know ahead of time the propname, use _dot notation_
- `this`'s value is determined by how you call the function:
  1. If the function is called with dot notation (as a method): `this` references the object before the dot
  2. References the Global Object or `undeined` in `'strict mode'` if a function is called without the dot notation. **EXCEPT** if this has been rebinded with:
     ```javascript
     const h = {myFunc() { return this;},}
     const mf = h.myFunc.bind(h);
     mf(); // called without dot notation, but still returning h
     ```
  3. If `new` is used in front of function call, `this` references the object created by `new` whose `__proto__` is `MyFunc.prototype`
- Arrow Functions
  - Are less verbose
    ```javascript
    const activeJobs = jobs.filter(job => job.isActive);
    ```
  - Bind the this keyword to value of `this` in the parent function they were defined in at call time.
  - Arrow Functions **DO NOT REBIND** `this`. Arrow functions will have the same value of `this` as the `this` of the wrapping function (in which they were defined) at calltime.
    ```javascript
    const person = {

      oldTalk() {
        var that = this;
        setTimeout(function() { // normal function
          console.log(this); // will print Global Obj or undefined
          console.log(that); // old stype workaround
        }, 1000);
      }

      newTalk() {
        setTimeout(() => { // arrow function
          console.log(this); // will print this object or Global Obj or undefined
        }, 1000);
      }

    };

    person.newTalk(); // will log person object
    const a = person.newTalk;
    a(); // will log Global Obj or undefined
    ```
- Array.map() introduced in ES6 and very used in React
  ```javascript
  const colors = ['red', 'green', 'blue'];
  const items = colors.map(color => `<li>${color}</li>`);
  ```
- Destructuring Object or Array
  ```javascript
  const address = {
    street: 'a',
    city: 'b',
    country: 'c',
  };
  const {street, country} = address;
  country; // 'c'

  const {city: differentVarName} = address
  differentVArName; // 'b'

  // Array destructuring
  const [ , , , four, , six] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  four; // 4
  six; // 6
  ```
- Spread
  - Easy combination (Arrays) 
  ```javascript
  const firstArr = [1,2,3];
  const secondArr = [4,5,6];

  // Old way to produce [1,2,3, 'a', 4,5,6]
  let combined = first;
  combined.push('a');
  combined = combined.concat(second)

  // ES6 way [1,2,3,4,5,6]
  const combinedES6 = [...firstArr, 'a', ...secondArr]; 
  ```
  - Easy cloning (Arrays)
  ```javascript
   const a = [1,2,3];
   // Arrays are objects so a and b are same object
   const b = a;
   // ES6 easy cloning a
   const c = [...a];
   // Changes to a affect b but not c
   a.push(4);

   b[3]; // 4 -> b same object as a
   c[3]; // undefined -> c is a real separate clone
  ```
  - Object combination
  ```javascript
  const first = {name: 'Mosh'};
  const second = {job: 'Instructor'};

  const combined = {...first, ...second, location: 'Australia'};
  ```
  - Object cloning
  ```javascript
  const first = {name: 'Mosh'};
  const clone = {...first};
  ```
- Classes
  ```javascript
  class Person {
    constructor(name) {
      this.name = name;
      this.instanceMethod = function() {
        console.log('method copied on each new Person instance');
      };
    }

    talk() { // prototype method
      return `My name is ${this.name}`;
    }

    walk() { // prototype method
      console.log('step step')
    }
  }

  const _p = new WeakMap();
  class Woman extends Person{
    constructor(name, ...handbagStuff) {

      super(name); // need to call super() before using 'this'

      [this.lipstick, this.mirror] = handbagStuff;

      //Private members
      _p.set(this, {});
      _p.get(this).handbagStuff = handbagStuff;

      // Instance method (copied over every instance)
      let allStuff = handbagStuff.join(',');
      this.methodWhoseContentsChangeFromObjectToObject() {
        console.log(allStuff);
      };
    }

    talk() {
      let usualTalk = super.talk();
      return `${usualTalk} and I'm a woman with ${_p.get(this).handbagStuff.length} items in my handbag`;
    }
  }

  const w = new Woman('Emily', 'Lipstick', 'Comb', 'Phone');
  w.talk(); // 'Hello my name is Emily and I'm a woman with 3 items in my handbag'
  ```
  - Our components will all inherit from React `Component` class
- Modules
  - To create a module, create a separate file.
  - By default all variables in the module are private. We need to export them to make them public 
  - Specifiying the source code file. You will use `./person` with `./` to import you own modules, and you will use `react` without `./` to import third party `node_module` folder modules.
  - Named Exports
    - In a file named `./person.js` write :
      ```javascript
      export class Woman extends Person { 
        //...
      }
      ```
    - In a file named `./woman.js` write :
      ```javascript
      import {Person} from './person';
      ```
    - Notice the `{Person}` tells Js which exported Object we want. Because all _named  exported_ objects are added to a wrapping object and the `{}` are ES6 usual object destructuring
  - Defaults Export
    - In a file named `./woman.js` write :
      ```javascript
      import {Person} from './person';

      export default class Woman extends Person { 
        //...
      }
      export function myFunc() {}
      ```
    - Notice the `export default` tells Js which object to export by default 
    - In a file where you want to use the Woman class :
      ```javascript
      import Woman from './woman';
      ```
    - Notice the lack of curly braces around `Woman`, this is because we used `export default` so the exported object is no longer wrapped into another object
  - Both _default exports_ and _named  exports_
    - You can use both a default and a buch of normal exports, if you do so, then you can stil get the _normal exports_ like this:
      ```javascript
      import Woman, {myFunc} from './woman';
      ```


