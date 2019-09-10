// console.log(arguments);
// console.log(require('module').wrapper);


// module.exports
const Calculator = require('./test-module1');

const calc1 = new Calculator();
console.log(calc1.add(2,3));

// export
// const calc2 = require('./test-module2')
// console.log(calc2.multiply(3,8));
const {add, multiply, divide} = require('./test-module2')
console.log(multiply(3,8));


// cqching
require('./test-module3')();
require('./test-module3')();
require('./test-module3')();