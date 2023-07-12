const http = require('http');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const bookData = {};

function promptUserInput(question) {
  return new Promise(res => {
    rl.question(question, answer => {
      res(answer);
    });
  });
}

async function collectAndSendBook() {
  bookData.title = await promptUserInput('Enter the book title: ');
  bookData.author = await promptUserInput('Enter the book author: ');
  bookData.releaseDate = await promptUserInput('Enter the release date: ');
  bookData.coverImg = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/300`;
  /*
  If you provide image in img folder

  bookData.coverImg = `img/${await promptUserInput('Specify image in img folder (img/___.jpg): ')}.jpg`;
  */

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
  });

  req.write(postData);
  req.end();
}

collectAndSendBook();
