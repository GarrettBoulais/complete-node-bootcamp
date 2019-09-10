const fs = require('fs');
const superagent = require('superagent');




// Callback hell
// fs.readFile(`${__dirname}/dog.txt`, (err,data) => {
//   console.log(`Breed: ${data}`);
//  //         .get returns a promise
//   superagent.get(`https://dog.ceo/api/breed/${data}/images/random`).end((err,res) => {
//     console.log(res.body.message);
//     fs.writeFile('dog-img.txt', res.body.message, err => {
//       if(err) return console.log(err.message);
//       console.log('Random dog image saved to file!')
//     })
//   })
// });



// fix
const readFilePro = file => {
  return new Promise((resolve,reject) => {
    fs.readFile(file,(err,data) => {
      if(err) reject('Error, could not find File');
      resolve(data);
    });
  });
}

const writeFilePro = (file,data) => {
  return new Promise((resolve,reject) => {
    fs.writeFile(file,data, err => {
      if(err) reject('Could not write the file');
      resolve('Success');
    })
  });
}

// readFilePro(`${__dirname}/dog.txt`).then(data => {
//   console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`)
// })
// .then(res => {
//   console.log(res.body.message);

//   return writeFilePro('dog-img.txt', res.body.message);
// })
// .then(() => console.log('Random Dog image saved to file!'))
// .catch(err => {
//   console.log(err);
// })


// const getDogPic = async () => {
//   try {
//     const data = await readFilePro(`${__dirname}/dog.txt`); 
//     console.log(`Breed: ${data}`);
  
//     const res = await superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//     console.log(res.body.message);
  
//     await writeFilePro('dog-img.txt', res.body.message);
//     console.log('Random dog photo saved to file')
//   }catch(err){
//     console.log('Error reading or writing dog file');
//     throw(err);
//   }
//   return '2: READY'
// }

// multiple requests
const getDogPic = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`); 
    console.log(`Breed: ${data}`);
  
    const res1Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res2Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const res3Pro = superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
    const all = await Promise.all([res1Pro,res2Pro,res3Pro]);
    const imgs = all.map(el => el.body.message);
    console.log(imgs);

    await writeFilePro('dog-img.txt', imgs.join('\n'));
    console.log('Random dog photo saved to file')
  }catch(err){
    console.log('Error reading or writing dog file');
    throw(err);
  }
  return '2: READY'
}

// console.log('1: Will Get Dog Pics');
// getDogPic().then(x => {
//   console.log(x);
//   console.log('3: Done Getting Dog Pics');
// }).catch(err => {
//   console.log('ERROR: ',err);
// })

(async () => {
  try {
    console.log('1: Will Get Dog Pics');
    const x = await getDogPic();
    console.log(x);
    console.log('3: Done Getting Dog Pics');
  }catch(err){
    console.log('ERROR');
  }
})();