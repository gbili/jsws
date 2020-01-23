const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN('ramda/0.21.0/ramda.min');
const jquery = CDN('jquery/3.0.0-rc1/jquery.min');

requirejs.config({ paths: { ramda, jquery } });
requirejs(['jquery', 'ramda'], ($, { compose, curry, last, split, }) => {

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

    // CH9 Ex 2
    // getFile :: IO String
    const getFile = IO.of('/home/mostly-adequate/ch09.md');
    // pureLog :: String -> IO ()
    const pureLog = str => new IO(() => console.log(str));
    // basename :: String -> String
    const basename = compose(last, split('/'));
    const logFilename1 = compose(chain(pureLog), map(basename))(getFile);
    //console.log(logFilename1.unsafePerformIO())

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

    // attempt
    // joinMailingList2 :: Email -> Either String (IO ())
    const joinMailingList2 = compose(
        map(emailBlast),
        map(addToMailingList),
        validateEmail
    );

    // solution
    // joinMailingList :: Email -> Either String (IO ())
    const joinMailingList = compose(
        map(compose(chain(emailBlast), addToMailingList)),
        validateEmail,
    );

    console.log('solution')
    console.log(joinMailingList("d@d.de"))
    console.log(joinMailingList("d@dd.de"))

    console.log('addToMailingList')
    const addToML = compose(map(chain(emailBlast)), map(addToMailingList), validateEmail);
    console.log(addToML("d@d.de"));
    console.log(addToML("d@dd.de"));

    // resolution
    addToML('d@dd.de');
    compose(map(map(emailBlast)), map(addToMailingList), validateEmail)('d@dd.de')
    compose(map(map(emailBlast)), map(addToMailingList))(validateEmail('d@dd.de'))
    compose(map(map(emailBlast)), map(addToMailingList))(new Right('d@dd.de'))
    compose(map(map(emailBlast)), map(addToMailingList))(rStr)
    compose(map(map(emailBlast)))(map(addToMailingList)(rStr))
    compose(map(map(emailBlast)))(rStr.map(addToMailingList))
    compose(map(map(emailBlast)))(Either.of(addToMailingList(rStr.$value)))
    compose(map(map(emailBlast)))(Either.of(addToMailingList('d@dd.de')))
    compose(map(map(emailBlast)))(Either.of(new IO(_ => emailList.concat(['d@dd.de']))))
    compose(map(map(emailBlast)))(new Right(new IO(_ => emailList.concat(['d@dd.de']))))
    map(map(emailBlast))(new Right(new IO(_ => emailList.concat(['d@dd.de']))))
    map(map(emailBlast))(rIO)
    // with map
    rIO.map(map(emailBlast))
    Either.of(map(emailBlast)(rIO.$value))
    Either.of(map(emailBlast)(io))
    Either.of(io.map(emailBlast))
    Either.of(new IO(compose(emailBlast, io.unsafePerformIO)))
    Either.of(new IO(compose(emailBlast, _ => emailList.concat(['d@dd.de']))))
    Either.of(new IO(compose(emailList => new IO(_ => emailList.map(e => console.log('Sending Email to : ', e) || { success: Math.random() > 0.5, email: e })), _ => emailList.concat(['d@dd.de']))))
    new Right(new IO(compose(emailList => new IO(_ => emailList.map(e => console.log('Sending Email to : ', e) || { success: Math.random() > 0.5, email: e })), _ => emailList.concat(['d@dd.de']))))
    // with chain
    rIO.map(chain(emailBlast))
    Either.of(chain(emailBlast)(rIO.$value))
    Either.of(chain(emailBlast)(io))
    Either.of(io.chain(emailBlast))
    Either.of(io.map(emailBlast).join())
    // copy resolution of io.map(emailBlast) from above and add .join() at the end
    Either.of(new IO(compose(emailList => new IO(_ => emailList.map(e => console.log('Sending Email to : ', e) || { success: Math.random() > 0.5, email: e })), _ => emailList.concat(['d@dd.de']))).join())
    Either.of(io2.join())
    Either.of(new IO(_ => io2.unsafePerformIO().unsafePerformIO()))
    new Right(new IO(_ => io2.unsafePerformIO().unsafePerformIO()))
    // if we do the actual call
    (new Right(new IO(_ => io2.unsafePerformIO().unsafePerformIO()))).$value.unsafePerformIO()
    (new IO(_ => io2.unsafePerformIO().unsafePerformIO())).unsafePerformIO()
    (_ => io2.unsafePerformIO().unsafePerformIO())()
    io2.unsafePerformIO().unsafePerformIO()
    compose(emailList => new IO(_ => emailList.map(e => console.log('Sending Email to : ', e) || { success: Math.random() > 0.5, email: e })), _ => emailList.concat(['d@dd.de']))().unsafePerformIO()
    compose(emailList => new IO(_ => emailList.map(e => console.log('Sending Email to : ', e) || { success: Math.random() > 0.5, email: e })))(emailList.concat(['d@dd.de'])).unsafePerformIO()
    compose(emailList => new IO(_ => emailList.map(e => console.log('Sending Email to : ', e) || { success: Math.random() > 0.5, email: e })))(['a@aa.at', 'b@b.be', 'c@cc.com', 'd@dd.de']).unsafePerformIO()
    (new IO(_ => ['a@aa.at', 'b@b.be', 'c@cc.com', 'd@dd.de'].map(e => console.log('Sending Email to : ', e) || { success: Math.random() > 0.5, email: e }))).unsafePerformIO()
    (['a@aa.at', 'b@b.be', 'c@cc.com', 'd@dd.de'].map(e => console.log('Sending Email to : ', e) || { success: Math.random() > 0.5, email: e }))
    // It works!!!


    console.log('join Mailing list')
    console.log(compose(either(identity, io => io.unsafePerformIO()), addToML)("d@d.de"));
    console.log(compose(either(identity, io => io.unsafePerformIO()), addToML)("d@dd.de"));

});