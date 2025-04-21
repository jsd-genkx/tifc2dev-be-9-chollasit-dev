const express = require('express');
const app = express();

app.use(express.json());

const books = [
  { id: 1, title: '1984', author: 'George Orwell', genre: 'Dystopian' },
  {
    id: 2,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    genre: 'Fiction',
  },
];

// GET books by genre (optional)
app.get('/books', (req, res, next) => {
  setTimeout(() => {
    const { genre } = req.query;
    const filteredBooks = books.filter((book) => book.genre.includes(genre));
    const noFilteredBooks = filteredBooks.length === 0;

    try {
      if (noFilteredBooks) {
        const booksNotFound = new Error('Filtered books not found');
        booksNotFound.status = 400;
        throw booksNotFound;
      }
    } catch (error) {
      return next(error);
    }

    res.send(filteredBooks);
  }, 1000);
});

// GET specific book by ID with async/await
app.get('/books/:id', async (req, res, next) => {
  const book = await new Promise((resolve, reject) => {
    const foundBook = books.find((b) => b.id === parseInt(req.params.id, 10));
    if (foundBook) {
      resolve(foundBook);
    } else {
      const bookNotFound = new Error('Book not found');
      bookNotFound.status = 404;
      reject(bookNotFound);
    }
  });

  try {
    if (book instanceof Error) {
      throw book;
    }

    res.send(book);
  } catch (error) {
    next(error);
  }
});

app.use((err, req, res, next) => {
  const response = {
    message: err.message ?? 'The unexpected',
    status: err.status ?? 400,
  };
  res.status(response.status).send(response);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
