import express from 'express';
import path from 'path';
import indexRouter from './routes/index.js';
import bookRouter from './routes/books.js';
import methodOverride from 'method-override';
import connectToDatabase from './database.js';
import dotenv from 'dotenv';
dotenv.config();

const __dirname = path.resolve();

const app = express();

app.use(methodOverride('_method'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/api/books', bookRouter);

connectToDatabase()
  .then(() => {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Сервер запущен на порту ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Ошибка подключения к базе данных:', err);
  });