## "Function is first class" means ?
- Don't wrap around callback function just to call it later.
```javascript
// ignorant
const getServerStuff = callback => ajaxCall(json => callback(json));

// enlightened
const getServerStuff1 = ajaxCall;

/* THET ARE EXACTLT THE SAME ON USAGE!!! */

// some func get things done
const updateView = (json) => {
  // do whatever you want with the fetched json
};
const addView = (json) => {...}


// verbose one
getServerStuff(updateView);
getServerStuff(addView); 

// but really....you can just run them
getServerStuff1(updateView);
getServerStuff1(addView);
```

- The only thing need to keep in mind is sometimes when dealing with 3rd party libs, you need to bind the `this` context:
```javascript
const fs = require('fs');

// scary
fs.readFile('freaky_friday.txt', Db.save);

// less so
fs.readFile('freaky_friday.txt', Db.save.bind(Db));
```

## "Being pure" means ?

- don't mutate the data (`slice` vs `splice`)
- don't depend on external state
```js
// if anything chaged `minAge`, this function is screwed
let minAge = 21;
const isMinAge = age => age >= minAge;

// let's put the const inside and make sure no one can change it accidently
const isMinAge = age => {
  const minAge = 21;
  return age >= minAge;
}
```

> Any interaction with the world outside of a function is a side effect. (EX: the above one who requires an outer variable)

### A pure function is just a **relation** between values

A **mapping** from an input to an output. (so one input should only have one output, but not vice-versa).

So it could be useful for
#### memorize (cachable)
```javascript
const memorize = (fn) => {
  const cache = {};
  return (...args) => {
    const key = JSON.stringify(args);
    const result = cache[key] || fn(...args);
    cache[key] = result;
    return result;
  }
}

const add = (x, y) => {
  return x + y;
}

const memorizedAdd = memorize(add);

memorizedAdd(3,4);
```

#### Self documentation (portable)
It'll be explict about *ALL* its dependencies

That also means we are force "injecting" the dependencies inside. So the function can run anywhere.

#### Testable
You don't have to mock a response to test the function. You only need to test the properties the output should hold, given an input.

#### Referentially transparent (reasonable)
So you can substitube a function with the its evaluated value, without changing the behavior of program.

One can easily reasoning the code by techniques like *equational reasoning*, when trying to refacto or understand the codes.

#### Parallel
As we don't have shared memories or race condition (which is caused mainly by some side effects), all functions can run in a parallel way.

## Tool belt

### Currying
```js
function curry(fn) {
  // how many params the function requires
  const arity = fn.length;

  /* in order to be able to take arbitrary number of args,
    we need to do the deconstruction everywhere
    */
  return function $curry(...args) {
    if (args.length < arity) {
      /* if the passed in params are less than required,
      we return a function that wait for other args, and feed them to the recursive $curry,
      and do the evaluation until we have all required args
      */
      return (...other) => $curry(...[...args, ...other]);
      // or a rather clever use of `bind`
      /* The bind() method creates a new function that, when called, has its this keyword set to the provided value, with a given sequence of arguments preceding any provided when the new function is called.
      See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_objects/Function/bind
      */
      // return $curry.bind(null, ...args);
    }
    return fn(...args);
  };
}

const match = curry((what, s) => s.match(what));
const replace = curry((what, replacement, s) => s.replace(what, replacement));

const hasLetterR = match(/r/g);
const replaceSpaceWithHypen = replace(" ", "-");

replaceSpaceWithHypen("hello world"); // "hello-world"
hasLetterR('hello world'); // ["r"]
```

> Giving a function fewer arguments than it expects is typically called *partial application*.

#### Exercise
```js
//by using the `curry` version, we can remove args
// Original
// const words = str => split(' ', str);

const split = curry((seperator, s) => s.split(seperator))
const words = split(' ');

// Original
// const filterQs = xs => filter(x => match(/q/i, x), xs);
const filter = curry((cond, xs) => xs.filter(cond));
const filterQs = filter(match(/q/i));

// const keepHighest = (x, y) => (x >= y ? x : y);
// Refactor `max` to not reference any arguments using the helper function `keepHighest`.
// max :: [Number] -> Number
// const max = xs => reduce((acc, x) => (x >= acc ? x : acc), -Infinity, xs);
const reduce = curry((fn, initalValue, xs) => xs.reduce(fn, initalValue));
const max = reduce(keepHighest, -Infinity);
```