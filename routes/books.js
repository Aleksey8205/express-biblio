import express from 'express';
import fs from 'fs/promises';
import { v4 as uuid } from 'uuid';
import upload from '../middleware/upload.js';

const router = express.Router();

let parsedData;
try {
    const data = await fs.readFile(new URL('./booksDB.JSON', import.meta.url), 'utf8');
    parsedData = JSON.parse(data);
} catch (err) {
    console.error('Ошибка при чтении файла:', err);
    process.exit(1); 
}

router.get('/', async (req, res) => {
    try {
        res.json(parsedData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при получении книг.');
    }
});

router.get('/:id', async (req, res) => {
    try {
        const book = parsedData.find(b => b.id === req.params.id);
        if (book) {
            res.json(book);
        } else {
            res.status(404).send('Книга не найдена');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при поиске книги.');
    }
});

router.post('/', upload.fields([{ name: 'file', maxCount: 1 }, { name: 'fileCover', maxCount: 1 }]), async (req, res) => {
    try {
        const { title, description, authors, favorite } = req.body;
        const uniqueId = uuid();

        const newBook = {
            id: uniqueId,
            title: title || 'Без названия',
            description: description || 'Описание отсутствует',
            authors: authors || 'Неизвестный автор',
            favorite: favorite || false,
            fileCover: req.files.fileCover[0].filename || "",
            fileName: req.files.file[0].filename || "",
            fileBook: req.files.file[0].path || "",
        };

        parsedData.push(newBook);

        await fs.writeFile(new URL('./booksDB.JSON', import.meta.url), JSON.stringify(parsedData, null, 2));

        res.json({
            message: "Книга добавлена",
            book: newBook
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при добавлении книги' });
    }
});


router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updateBook = req.body;
        const bookIndex = parsedData.findIndex((book) => book.id === id);
        if (bookIndex !== -1) {
            parsedData[bookIndex] = { ...updateBook, id };
            await fs.writeFile(new URL('./booksDB.JSON', import.meta.url), JSON.stringify(parsedData, null, 2));
            res.json({ message: "Книга обновлена" });
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
        const bookIndex = parsedData.findIndex((book) => book.id === id);
        if (bookIndex !== -1) {
            parsedData.splice(bookIndex, 1);
            await fs.writeFile(new URL('./booksDB.JSON', import.meta.url), JSON.stringify(parsedData, null, 2));
            res.json({ message: "Книга удалена" });
        } else {
            res.status(404).json({ error: 'Книга не найдена' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при удалении книги' });
    }
});

router.get('/:id/download', async (req, res) => {
    try {
        const { id } = req.params;
        const book = parsedData.find(b => b.id === id);
        if (book) {
            res.download(book.fileBook, book.fileName);
        } else {
            res.status(404).send('Книга не найдена');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при скачивании книги.');
    }
});

export default router;