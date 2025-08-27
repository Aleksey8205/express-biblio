import express from 'express';
import router from './routes/books.js';

const app = express();
app.use(express.json());

app.use('/api/books', router);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});