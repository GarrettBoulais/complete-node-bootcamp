const fs = require('fs'); // get access to reading and writing data. returns an object
const http = require('http'); // gives us networking
const url = require('url'); //

//////////////////////////////////////////////////
// FILES
//////////////////////////////////////////////////

// Blocking code execution, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');

// const textOut = `This is what we know about the avocado:\n ${textIn}\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut);
// console.log('File Written');

// Non-blocking, asynchronous way
// fs.readFile('./txt/start.txt', 'utf-8', (err,data1) => { // error first is typical of node js
//   if(err) {
//     return console.log('ERROR!');
//   }
//   fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err,data2) => {
//     console.log(data2);
//     fs.readFile('./txt/append.txt','utf-8', (err,data3) => {
//       console.log(data3);
//       fs.writeFile('./txt/final.txt',`${data2}\n${data3}`,'utf-8', (err) => {
//         console.log('File has been written.');
//       });
//     });
//   });
// });
// console.log('Will read file');




//////////////////////////////////////////////////
// SERVER
//////////////////////////////////////////////////

// this function is only executed once at beginning
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObject = JSON.parse(data);

// create a server
// every time a new request hits our server, this callback function 
// will be called
const server = http.createServer((req,res) => {
  console.log(req.url);

  const pathName = req.url;
  if(pathName === '/' || pathName === '/overview') {
    res.end('This is the OVERVIEW');

  } else if(pathName === '/product') {
    res.end('This is the PRODUCT');

  } else if(pathName === '/api') {
   res.writeHead(200, { 'Content-type': 'application/json'});
   res.end(data);

  } else {
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    // note we can never send headers after the response
    res.end('<h1>Page not found</h1>');
  }

 // res.end('Hello from the server');
});

// listen for incoming requests
server.listen(8000, '127.0.0.1', () => {
  console.log("Listening to requests on port 8000");
});
