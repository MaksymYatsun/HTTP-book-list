const http = require('http');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function promptUserInput(question) {
  return new Promise(res => {
    rl.question(question, answer => {
      res(answer);
    });
  });
}

async function collectAndSendBook() {
  const bookData = {
    title: await promptUserInput('Enter the book title: '),
    author: await promptUserInput('Enter the book author: '),
    releaseDate: await promptUserInput('Enter the release date: '),
    coverImg: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`
    /*
    If you provide an image in img folder
    coverImg = `img/${await promptUserInput('Specify image in img folder (img/___.jpg): ')}.jpg`;
    */
  };

  rl.close();

  const postData = JSON.stringify(bookData);

  const req = http.request({
    hostname: 'localhost',
    port: 3000,
    path: '/books',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': postData.length
    }
  }, res => {
    if (res.statusCode === 201) {
      console.log(`${res.statusCode}: Book was created`)
    } else {
      console.log(`${res.statusCode}: Check provided data`)
    }
  });

  req.write(postData);
  req.end();
}

collectAndSendBook();
