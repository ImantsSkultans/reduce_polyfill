/*
A polyfill is a piece of code (usually JavaScript on the Web) used to provide modern functionality on older browsers that do not natively support it.

https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce#Polyfill
https://gomakethings.com/using-array.reduce-in-vanilla-js/

Array.reduce was introduced in ECMAScript 5 in 2009. And its supported including IE9.
https://caniuse.com/#feat=mdn-javascript_builtins_array_reduce

Array reduce accepts two arguments: a callback method (reducer function) to run against each item in the array, and a starting value.
The reducer function (callback) takes four arguments: Accumulator (acc), Current Value (cur), Current Index (idx), Source Array (src)

This Array reduce polyfill is inspired by MDN polyfill, except with more detailed comments, better naming and better error handling. Including some test scenarios.
*/

'use strict';

function throwError(errorMessage) {
  throw new TypeError(errorMessage);
}

function reduce() {
  // Modern browsers check scope automatically and throws: Uncaught TypeError: Cannot read property 'reduce' of null / undefined
  // For legacy browsers we should check if we have scope to work with
  if (this === null) {
    throwError('Array.prototype.reduce called on null');
  }
  if (this === undefined) {
    throwError('Array.prototype.reduce called on undefined');
  }

  // We can get arguments from passed parameters or we can get from functions 'arguments' -
  // an Array-like object accessible inside functions that contains the values of the arguments passed to that function.
  var callback = arguments[0];
  var startingValue = arguments[1];

  // If calllback is not a function, lets throw an error
  if (typeof callback !== 'function') {
    throwError(callback + ' is not a function');
  }

  // Convert source array to object
  // To make sure reduce is called on an object as reduce could be called through call, apply or bound with bind
  var sourceArrayAsObject = Object(this);

  // Bitwise operator - to always have a valid integer value as length (even if it doesn't exist):
  var sourceArrayLength = sourceArrayAsObject.length >>> 0;

  // Our counter for iteration through sourceArray
  var k = 0;

  // Our value which will store (count) all items
  // Example on how bad JavaScript was back in days - variable, which gets mutated
  var value;

  if (arguments.length >= 2) {
    // If there are at least 2 arguments, then second is startingValue
    // If startingValue is undefined, then throw error, otherwise result will be NaN
    if (startingValue === undefined) {
      throwError('Reduce initial value can not be undefined');
    }
    // Otherwise we can set value. Note - null works as 0
    value = startingValue;
  } else {
    // If startingValue is not passed, then look for next valid item in sourceArray
    while (k < sourceArrayLength && !(k in sourceArrayAsObject)) {
      k++;
    }

    // If sourceArrayLength is 0 and startingValue is not present, throw error
    if (k >= sourceArrayLength) {
      throwError('Reduce of empty array with no initial value');
    }
    // Set next valid item in sourceArray as value
    value = sourceArrayAsObject[k++];
  }

  // Repeat iteration, while k < sourceArrayLength
  while (k < sourceArrayLength) {
    // Take in account only valid items, skip comma separated empty values
    if (k in sourceArrayAsObject) {
      // Do not allow undefined values, otherwise result will be NaN
      if (sourceArrayAsObject[k] === undefined) {
        throwError('Reduce value can not be undefined');
      }

      // set and process next accumulator
      value = callback(value, sourceArrayAsObject[k], k, sourceArrayAsObject);
    }

    k++;
  }

  // Return reduced value.
  return value;
}

// For enabling reduce only for old legacy browsers, enable check
// Otherwise current polyfill overwrites existing Array reduce
// if (!Array.prototype.reduce) {
Object.defineProperty(Array.prototype, 'reduce', {
  value: reduce
});
// }

/*
TESTING REDUCE FUNCTION
*/

var numberArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];
var numberArrayResult = numberArray.reduce(function(sum, current) {
  return sum + current;
}, 0);

console.log(
  'TEST: number array ' +
    JSON.stringify(numberArray) +
    ' with starting value 0 should reduce to 45 = ' +
    numberArrayResult,
  numberArrayResult === 45
);

var expectedResult = { name: 'Foo', value: 99 };
var objectArray = [{ name: 'Foo' }, {}, { value: 99 }];
var objectArrayResult = objectArray.reduce(function(sum, current) {
  return Object.assign(sum, current);
}, {});

console.log(
  'TEST: defined object array ' +
    JSON.stringify(objectArray) +
    ' should reduce to ' +
    JSON.stringify(objectArrayResult),
  JSON.stringify(expectedResult) === JSON.stringify(objectArrayResult)
);

var autoArray = [
  'bmw',
  'audi',
  'volvo',
  'volvo',
  'tesla',
  'audi',
  'bmw',
  'bmw',
  'saab'
];
var autoArrayResult = autoArray.reduce(function(sum, current) {
  sum[current] = (sum[current] || 0) + 1;
  return sum;
}, {});

console.log(
  'TEST: should count provided array object equal items:',
  autoArrayResult,
  autoArrayResult.bmw === 3
);

var multiNumberArray = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9]
];
var flatNumberArray = multiNumberArray.reduce(function(sum, current) {
  return sum.concat(current);
}, []);

console.log(
  'TEST: multiple number arrays should flattern to one number array ' +
    flatNumberArray +
    ' and should be equal to ' +
    numberArray,
  flatNumberArray.join() === numberArray.join()
);

var definedWord = 'R3duc3';
var mixedContentArray = ['R', 3, 'd', , 'uc', 3];
var mixedContentResult = mixedContentArray.reduce(function(sum, current) {
  return sum + current;
});

console.log(
  'TEST: mixed content array ' +
    JSON.stringify(mixedContentArray) +
    ' (letters and numbers) should reduce as word ' +
    mixedContentResult,
  definedWord === mixedContentResult
);
