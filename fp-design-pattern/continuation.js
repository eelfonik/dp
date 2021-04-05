// Assume we have an async add function
const addAsync = (x, y, cb) => setTimeout(() => cb(x + y), 1000)

// normal version with callbacks
addAsync(2, 1, result1 => {
  console.log({ result1 })
  addAsync(3, result1, result2 => {
    console.log({ result2 })
    addAsync(4, result2, result3 => {
      console.log({result3})
      // you can chain it with the pyramide style...
    })
  })
})

// continuation version

const addAsyncCo = val => next => result => {
  if (result) {
    setTimeout(() => next(result + val), 1000)
  } else {
    //do nothing
    console.log('nothing')
  }
}

const next = result => result
const done = result => {
  console.log({ final: result })
}
// second 
const goNext = (nextFn, result) => {
  console.log( {nextFn, result} )
  if (result) {
    // nextFn would be `done` or `addAsyncCo(val)(next)
    nextFn(result)
  } else {
    //do nothing
    console.log('nothing')
  }
} 

// const continuation = val => goNext(1)(addAsyncCo(1)(0))

// first way to use them
// it asked us to write the process in a reversed order
// which is not very natural
const add1 = addAsyncCo(2)(next)(1)
const add2 = addAsyncCo(3)(next)(add1)
const add3 = addAsyncCo(4)(done)(add2)

// or you can use the redux applyMiddleware style
// expand all then fold to final result:

// const applyContinuation = (valArr) => valArr.map(val => continuation(val)).reduce((acc, valFn) => {
//   valFn(acc)
// })

// Or if we finally has pipeline operator in js...


