# reduce_polyfill

A polyfill is a piece of code (usually JavaScript on the Web) used to provide modern functionality on older browsers that do not natively support it.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Polyfill
https://gomakethings.com/using-array.reduce-in-vanilla-js/

Array.reduce was introduced in ECMAScript 5 in 2009. And its supported even by IE9.
https://caniuse.com/#feat=mdn-javascript_builtins_array_reduce

Array reduce accepts two arguments: a callback method (reducer function) to run against each item in the array, and a starting value.
The reducer function (callback) takes four arguments: Accumulator (acc), Current Value (cur), Current Index (idx), Source Array (src)

This Array reduce polyfill is inspired by MDN polyfill, except with more detailed comments, better naming and better error handling. Including some test scenarios.

p.s. thank GOD that nowdays we have const, arrow functions and of course reduce out of the box
