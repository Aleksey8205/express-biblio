import express from 'express';
import multer from 'multer';
import { BookModel } from '../models/book.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, './uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get('/', async (req, res) => {
  try {
    const books = await BookModel.find({});
    res.render('books/index', {
      title: 'Просмотр книг',
      books: books,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при получении книги.');
  } 
});

router.get('/create', (req, res) => {
  res.render('books/create', {
    title: 'Создание книги',
  });
});

router.get('/:id', async (req, res) => {
    try {
      const bookId = req.params.id;

      let book = await BookModel.findById(bookId);
  
      if (!book) {
        return res.status(404).send('Книга не найдена');
      }

      book.viewCount += 1;

      await book.save();

      res.render('books/view', {
        title: 'Просмотр',
        book: book,
        viewCount: book.viewCount, 
      });
    } catch (err) {
      console.error('Ошибка при обработке:', err.message);
      res.status(500).send('Ошибка при поиске книги.');
    }
  });

router.post('/creates', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'fileCover', maxCount: 1 }]), async (req, res) => {
  try {
    const { title, description, authors, favorite } = req.body;
    const newBook = new BookModel({
        title: title || 'Без названия',
        description: description || 'Описание отсутствует',
        authors: authors || 'Неизвестный автор',
        favorite: favorite || false,
        fileCover: req.files?.fileCover[0]?.filename || '',
        fileName: req.files?.file[0]?.filename || '',
      });

    await newBook.save();
    res.redirect('/');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при добавлении книги' });
  }
});

router.get('/:id/update', async (req, res) => {
  try {
    const book = await BookModel.findById(req.params.id);
    if (book) {
      res.render('books/update', {
        title: 'Редактировать книгу',
        book: book,
      });
    } else {
      res.status(404).send('Книга не найдена');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Ошибка при поиске книги.');
  }
});

router.put('/:id', upload.none(), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedBook = req.body;

    delete updatedBook._method;

    const existingBook = await BookModel.findById(id);
    if (existingBook) {
      Object.assign(existingBook, updatedBook);
      await existingBook.save();
      res.json({ message: 'Книга обновлена' });
    } else {
      res.status(404).json({ error: 'Книга не найдена' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при обновлении книги' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBook = await BookModel.findByIdAndDelete(id);
    if (deletedBook) {
      res.json({ message: 'Книга удалена' });
    } else {
      res.status(404).json({ error: 'Книга не найдена' });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Ошибка при удалении книги' });
  }
});

export default router;