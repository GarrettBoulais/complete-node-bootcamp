const fs = require('fs');
const crypto = require('crypto');


const start = Date.now()
process.env.UV_THREADPOOL_SIZE = 1

setTimeout(() => console.log('Timer 1 finished'), 0);
setImmediate(() => console.log('Immediate 1 finished'));

fs.readFile('test-file.txt', () => {
  console.log('I/O finished');

  setTimeout(() => console.log('Timer 2 finished'), 0);
  setTimeout(() => console.log('Timer 3 finished'), 3000);
  setImmediate(() => console.log('Immediate 3 finished')); 

  process.nextTick(() => console.log('next tick'));

  crypto.pbkdf2('password','salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, "Password Encrypted");
  });
  crypto.pbkdf2('password','salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, "Password Encrypted");
  });
  crypto.pbkdf2('password','salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, "Password Encrypted");
  });
  crypto.pbkdf2('password','salt', 100000, 1024, 'sha512', () => {
    console.log(Date.now() - start, "Password Encrypted");
  });
});


console.log('Hello from the top level code');
