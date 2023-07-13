const http = require('http');
const fs = require('fs');
const path = require('path');

const server = http.createServer(async (req, res) => {
  switch (req.url) {
    case '/books':
      if (req.method === 'GET') {
        const bookDBPath = path.join(__dirname, 'books.json');
        const data = await fs.promises.readFile(bookDBPath, 'utf8');
        const books = JSON.parse(data).map(book =>
          `<div class="book-card">
              <img src="${book.coverImg}" alt="Book Cover">
              <div class="book-card-content">
                <h2>${book.title}</h2>
                <p>Author: ${book.author}</p>
                <p>Release Date: ${book.releaseDate}</p>
              </div>
            </div>
          `).join('');

        const htmlFilePath = path.join(__dirname, 'books.html');
        const htmlFileData = await fs.promises.readFile(htmlFilePath, 'utf8');
        const modifiedHtml = htmlFileData.replace('<!-- BOOKS_PLACEHOLDER -->', books);
        res.setHeader('Content-Type', 'text/html');
        res.end(modifiedHtml);
        break;
      }

      if (req.method === 'POST') {
        let body = '';
        req.on('data', bookInf => {
          body += bookInf.toString();
        });
        req.on('end', async () => {
          const book = JSON.parse(body);
          const booksFilePath = path.join(__dirname, 'books.json');
          const data = await fs.promises.readFile(booksFilePath, 'utf8');
          const books = JSON.parse(data);
          const newBook = { ...book, id: books.length + 1 };
          books.push(newBook);
          const updatedBooksData = JSON.stringify(books);

          await fs.promises.writeFile(booksFilePath, updatedBooksData, 'utf8');
          res.statusCode = 201;
          res.end();
        });
      }
    case '/style.css':
      const cssPath = path.join(__dirname, 'style.css');
      const cssData = await fs.promises.readFile(cssPath, 'utf8');
      res.setHeader('Content-Type', 'text/css');
      res.end(cssData);
      break;
    default:
      if (req.url.startsWith('/img/')) {
        const imgPath = path.join(__dirname, req.url);
        const data = await fs.promises.readFile(imgPath);
        res.end(data);
      }
      break;
  }
});

server.listen(3000, () => {
  console.log(`Server listening on port 3000`);
});