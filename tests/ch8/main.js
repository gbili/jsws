const CDN = s => `https://cdnjs.cloudflare.com/ajax/libs/${s}`;
const ramda = CDN('ramda/0.21.0/ramda.min');
const jquery = CDN('jquery/3.0.0-rc1/jquery.min');

requirejs.config({ paths: { ramda, jquery } });
requirejs(['jquery', 'ramda'], ($, { compose, curry, map, prop, }) => {

class Maybe {
    static of(x) {
        return new Maybe(x);
    }

    get isNothing() {
        return this.$value === null || this.$value === undefined;
    }

    constructor(x) {
        this.$value = x;
    }

    map(fn) {
        return this.isNothing ? this : Maybe.of(fn(this.$value));
    }

    inspect() {
        return this.isNothing ? 'Nothing' : `Just(${inspect(this.$value)})`;
    }
}


// safeHead :: [a] -> Maybe(a)
const safeHead = xs => Maybe.of(xs[0]);

// streetName :: Object -> Maybe String
const streetName = compose(map(prop('street')), safeHead, prop('addresses'));

console.log(map.toString());

console.log(streetName({ addresses: [], }));
// Maybe(undefined).inspect();
// Nothing

console.log(streetName({ addresses: [{ street: 'Shady in.', number: 4201 }], }));
// Maybe('Shade in.')

});