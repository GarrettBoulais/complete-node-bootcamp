const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req,res) => {
  // // Solution 1
  // fs.readFile('test-file.txt', (err,data) => {
  //   if(err) console.log(err);
  //   res.end(data);
  // });
  // // problem: node has to load entire file into memory in order to send data
  // // only works for something small



  // // Solution 2: streams
  // const readable = fs.createReadStream('test-file.txt');
  // readable.on('data', chunk => {
  //   res.write(chunk); // write to stream chunk by chunk
  // });

  // readable.on('end', () => {
  //   res.end();
  // });

  // readable.on('error', err => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found!');
  // });

  // // problem : readable stream is way faster than response stream which cannot 
  // // handle all of this data "back pressure"



  // Solution 3: use pipe operator
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res);
  // readableSource.pipe(writeableDest)
});

server.listen(8000,'127.0.0.1', () => {
  console.log('Listening...');
})