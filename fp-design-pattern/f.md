# Core principles

## Why we need immutability
It's kind of weird as mutable variables is a good mapping of the underlying hardware (a memory cell).

But to be able to think about things in a higher abstract way, we try to apply mathematic theories to programming (as they are already proven), and in math, there's no such thing like mutation. 

## Function are things
`const a = 1`
`const b = () => {}`

same keyword is not a coincidence:
- function as return value
- function as parameter => parameter everything, including action/data

## Composition
- service => composition of smaller functions
- use case => comp of services
- web app => comp of use cases

## Types are not classes
- type is for data, not for behaviors

- comp of type => algebraic types (multiply types or sum types)

- types are documentations (think about `maybe(optional)` type) => use static types for *domain modeling* : things are illegal in real world usecases will cause **compiling time errors** in program


# Design patterns

## function as parameters
- Function types (EX: int -> int) are *interfaces* (with only one method each) => here we're applying Single Responsibility Principle & Interface Segregation Principle

- Strategy pattern (Deferring the decision about which algorithm to use until runtime) => pass the strategy function as param

- Decorator pattern (add behaviours to an object without affecting the behaviors of other objects from the same class) => HOC (function as param) or composition (function composition)

  N.B. for composition to work, we should make use of currying (partial application) & force every function to have only one param

### Pattern: Partial Application
- Define functions with no params (as a value) or only one param:
```javascript
const add = (x, y) => x + y
// add(2, 1)

//or
const add = x => y => x + y

// then we can use partial application
const add1 = add(1)
// add1(2) -> 3
const add4 = add(4)
// add4(2) -> 6
```

### Pattern: Partial Application in list
- If we take the **Partial Application** to a common case, then lots of methods in js (`map`, `filter`, `reduce`) that works with array(`list` in some other languages) is a *partial application*, that need to pass each item in the array to get the final value.

### Pattern: dependency injection done with partical application

```typescript
type GetCustomer: Customer = (id: customerId) => Customer

// image you need to connect to a db to get the customer
const getFromDb = (dbConnection) => (id: customerId) => Customer
// To confine with the type def of GetCustomer, we can use partial application
const getCustomer = getFromDb(dbConnection)
// Then the getCustomer function will have a signature of customerId -> Customer, and it has a db connection baked in (thus the injection of dependency)
```

### Pattern: Hollywood principle (continuation)
**Don't call us, we'll call you**

Let the caller decide what to do (behaviors) rather than throw an error inside a function
```typescript
// normal one
const divide = (top, bottom) => {
  if (bottom === 0) {
    throw new Error('cannot divide')
  } else {
    return top/bottom
  }
}

//continuation
const ifZero = () => undefined
const ifSuccess = (val) => val
const divide = (ifZero, ifSuccess, top, bottom) => {
  if (bottom === 0) {
    ifZero()
  } else {
    ifSuccess(top/bottom)
  }
}
// or
const divide = (ifZero, ifSuccess) => (top, bottom) => {
  if (bottom === 0) {
    ifZero()
  } else {
    ifSuccess(top/bottom)
  }
}

const divide1 = divide(ifZero, ifSuccess)
// then const result = divide1(top, bottom)

// or if you want, you can pass other functions as the ifZero/ifSuccess
```

Another example using continuation to do chaining callbacks, see the [continuation test](./continuation.js)

- continuation means never return?



