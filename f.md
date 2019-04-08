# Core principles
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

- Strategy pattern (Deferring the decision about which algorithm to use until runtime) => pass the strategy as param

- Decorator pattern (add behaviours to an object without affecting the behaviors of other objects from the same class) => HOC (function as param) or composition (function composition)

  N.B. for composition to work, we should make use of currying (partial application) & force every function to have only one param

