// compose :: ((a -> b), (b -> c),  ..., (y -> z)) -> a -> z
const compose = (...fns) => (...args) => fns.reduceRight((res, fn) => [fn.call(null, ...res)], args)[0];

// curry :: ((a, b, ...) -> c) -> a -> b -> ... -> c
function curry(fn) {
    const arity = fn.length;

    return function $curry(...args) {
        if (args.length < arity) {
            return $curry.bind(null, ...args);
        }

        return fn.call(null, ...args);
    };
}

// identity :: x -> x
const identity = x => x;

// either :: (a -> c) -> (b -> c) -> Either a b -> c
const either = curry((f, g, e) => {
    if (e.isLeft) {
        return f(e.$value);
    }

    return g(e.$value);
});

class Either {
    constructor(x) {
        this.$value = x;
    }

    // ----- Pointed (Either a)
    static of(x) {
        return new Right(x);
    }
}

class Left extends Either {
    get isLeft() {
        return true;
    }

    get isRight() {
        return false;
    }

    static of(x) {
        throw new Error('`of` called on class Left (value) instead of Either (type)');
    }

    // ----- Functor (Either a)
    map() {
        return this;
    }

    // ----- Applicative (Either a)
    ap() {
        return this;
    }

    // ----- Monad (Either a)
    chain() {
        return this;
    }

    join() {
        return this;
    }

    // ----- Traversable (Either a)
    sequence(of) {
        return of(this);
    }

    traverse(of, fn) {
        return of(this);
    }
}

class Right extends Either {
    get isLeft() {
        return false;
    }

    get isRight() {
        return true;
    }

    static of(x) {
        throw new Error('`of` called on class Right (value) instead of Either (type)');
    }

    // ----- Functor (Either a)
    map(fn) {
        return Either.of(fn(this.$value));
    }

    // ----- Applicative (Either a)
    ap(f) {
        return f.map(this.$value);
    }

    // ----- Monad (Either a)
    chain(fn) {
        return fn(this.$value);
    }

    join() {
        return this.$value;
    }

    // ----- Traversable (Either a)
    sequence(of) {
        return this.traverse(of, identity);
    }

    traverse(of, fn) {
        fn(this.$value).map(Either.of);
    }
}

class IO {
    constructor(fn) {
        this.unsafePerformIO = fn;
    }

    // ----- Pointed IO
    static of(x) {
        return new IO(() => x);
    }

    // ----- Functor IO
    map(fn) {
        return new IO(compose(fn, this.unsafePerformIO));
    }

    // ----- Applicative IO
    ap(f) {
        return this.chain(fn => f.map(fn));
    }

    // ----- Monad IO
    chain(fn) {
        return this.map(fn).join();
    }

    join() {
        return new IO(() => this.unsafePerformIO().unsafePerformIO());
    }
}

class Maybe {
    get isNothing() {
        return this.$value === null || this.$value === undefined;
    }

    get isJust() {
        return !this.isNothing;
    }

    constructor(x) {
        this.$value = x;
    }

    // ----- Pointed Maybe
    static of(x) {
        return new Maybe(x);
    }

    // ----- Functor Maybe
    map(fn) {
        return this.isNothing ? this : Maybe.of(fn(this.$value));
    }

    // ----- Applicative Maybe
    ap(f) {
        return this.isNothing ? this : f.map(this.$value);
    }

    // ----- Monad Maybe
    chain(fn) {
        return this.map(fn).join();
    }

    join() {
        return this.isNothing ? this : this.$value;
    }

    // ----- Traversable Maybe
    sequence(of) {
        return this.traverse(of, identity);
    }

    traverse(of, fn) {
        return this.isNothing ? of(this) : fn(this.$value).map(Maybe.of);
    }
} 

class Task {

    // constructor :: ((reject, resolve) -> a)) -> Task
    // fork :: (reject, resolve) -> a 
    // fork is a two parameter function, where the first 
    // parameter is called as a function on fail and
    // the second is called on success.
    // A call to fork should recieve two parameters
    constructor(fork) {
        this.fork = fork;
    }

    static rejected(x) {
        return new Task((reject, _) => reject(x));
    }

    // ----- Pointed (Task a)
    // of :: a -> Task ((_, resolve) -> resolve(a))
    static of(x) {
        return new Task((_, resolve) => resolve(x));
    }

    // ----- Functor (Task a)
    map(fn) {
        return new Task((reject, resolve) => this.fork(reject, compose(resolve, fn)));
    }

    // ----- Applicative (Task a)
    ap(f) {
        return this.chain(fn => f.map(fn));
    }

    // ----- Monad (Task a)
    chain(fn) {
        return new Task((reject, resolve) => this.fork(reject, x => fn(x).fork(reject, resolve)));
    }

    join() {
        return this.chain(identity);
    }
}    

// map :: Functor f => (a -> b) -> f a -> f b
const map = curry((fn, f) => f.map(fn));
// join :: Monad m => m (m a) -> m a
const join = m => m.join();
// chain :: Monad m => (a -> m b) -> m a -> m b
const chain = curry((fn, m) => m.chain(fn));
// prop :: String -> Object -> a
const prop = curry((p, obj) => obj[p]);
// safeProp :: String -> Object -> Maybe a
const safeProp = curry((p, obj) => compose(Maybe.of, prop(p))(obj));

const user = {  
    id: 1,  
    name: 'Albert',  
    address: {  
        street: {  
        number: 22,  
        name: 'Walnut St',  
        },  
    },  
};

// CH9 Ex 3

const left = a => new Left(a);

const emailList = ['a@aa.at', 'b@b.be', 'c@cc.com'];
// addToMailingList :: Email -> IO([Email])
const addToMailingList = email => new IO(_ => emailList.concat([email]));
// emailBlast :: [Email] -> IO ()
const emailBlast = emailList => new IO(_ => emailList.map(e => console.log('Sending Email to : ', e) || { success: Math.random() > 0.5, email: e }));
// validateEmail :: Email -> Either String Email
const validateEmail = email => (
    email.length > 6
    ? Either.of(email)
    : left('Email must be more than 3 chars long')
);

const Http = {
    get: url => new Task((reject, resolve) => {
        console.log(url, '--- task start');
        setTimeout(function () {

            console.log(url, '--- timeout start');

            if (url === 'badUrl') return reject(new Error("Bad Url")); 

            resolve(url === '/destinations'
                ? ["Albi", "Barcelona", "Catania", "Dortmund", ]
                : [{ where: "Albi", when: 10 }, { where: "Dortmund", when: 11 }]
            );

        }, 2000);
    }),
}

const renderPage = curry((destinations, events) => {
    console.log('render page start');
    console.log(destinations, events);
    console.log('render page end')
});

const t = Task.of(renderPage).ap(Http.get('/destinations')).ap(Http.get('/events'));
const tb = Task.of(renderPage).ap(Http.get('/badUrl')).ap(Http.get('/events'));

const afterTask2Completes = console.log;
const afterTask2Rejects = error => {
    console.log('Task 2 Rejected', error);
};

const afterTask1Rejects = console.log;
const afterTask1Completes = _ => {
    console.log('Task 1 Completed');

    // start task 2 after, to not pollute the console with mixed outputs
    console.log(tb.fork(afterTask2Rejects, afterTask2Completes));
};

console.log(t.fork(afterTask1Rejects, afterTask1Completes));



const tb = Task.of(renderPage).ap(Http.get('/destinations'));
(new Task((_, resolve) => resolve(renderPage))).ap(Http.get('/destinations'));
(new Task((_, resolve) => resolve(renderPage))).ap(new Task((reject, resolve) => { setTimeout(_ => resolve('/destinations'), 1000); }));
(new Task((_, resolve) => resolve(renderPage))).chain(fn => (new Task((reject, resolve) => { setTimeout(_ => resolve('/destinations'), 1000); })).map(fn));
new Task((reject0, resolve0) => (
    (new Task((_, resolve1) => resolve1(renderPage)))
        .fork(
            reject0,
            x => (
                (fn => (new Task((reject, resolve2) => { setTimeout(_ => resolve2('/destinations'), 1000); })).map(fn))(x)
                    .fork(reject0, resolve0)
            )
        )
));
new Task((reject0, resolve0) => (
    (new Task((_, resolve1) => resolve1(renderPage)))
        .fork(
            reject0,
            x => (
                (fn => (new Task((reject, resolve2) => { setTimeout(_ => resolve2('/destinations'), 1000); })).map(fn))(x)
                    .fork(reject0, resolve0)
            )
        )
));

tb.fork(_ => console.log('rejected'), _ => console.log('resolved'));