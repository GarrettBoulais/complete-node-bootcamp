const fs = require('fs'); // get access to reading and writing data. returns an object
const http = require('http'); // gives us networking
const url = require('url'); // want to parse variables off of url

// third party module
const slugify = require('slugify');

// our own module
const replaceTemplate = require('./modules/replaceTemplate');

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
const dataObject = JSON.parse(data); // parse data into an object

// load templates into memory once
const templateOverview = fs.readFileSync(`${__dirname}/templates/templateOverview.html`, 'utf-8');
const templateCard = fs.readFileSync(`${__dirname}/templates/templateCard.html`, 'utf-8');
const templateProduct = fs.readFileSync(`${__dirname}/templates/templateProduct.html`, 'utf-8');

// create slugs so we can replace the query ?id=0 with fresh-avacados
const slugs = dataObject.map(el => slugify(el.productName, { lower: true }));

// create a server
const server = http.createServer((req, res) => {
  // turns url into object so we can get the query
  const { query, pathname } = url.parse(req.url, true);

  // OVERVIEW PAGE
  if (pathname === '/' || pathname === '/overview') {
    // 1. say what the content is
    res.writeHead(200, { 'Content-type': 'text/html' });

    // replace templates with product info in dataObject, join into
    // a single string
    const cardsHtml = dataObject.map(el => replaceTemplate(templateCard, el)).join('');
    // insert all cards (they are in one string) html into overview page
    const output = templateOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);

    res.end(output);

    // PRODUCT PAGE
  } else if (pathname === '/product') {
    res.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObject[query.id];
    const productHtml = replaceTemplate(templateProduct, product);
    res.end(productHtml);

    // API
  } else if (pathname === '/api') {
    res.writeHead(200, { 'Content-type': 'application/json' });
    res.end(data);

    // NOT FOUND
  } else {
    res.writeHead(404, {
      'Content-type': 'text/html'
    });
    // note we can never send headers after the response
    res.end('<h1>Page not found</h1>');
  }
});

// listen for incoming requests
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
