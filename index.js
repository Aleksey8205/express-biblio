const express = require("express");
const { v4: uuid } = require('uuid');
const app = express();
const fs = require('fs');
const path = require('path');
const config = require("./config.js");

app.use(express.json());


let parsedData;
try {
    const data = fs.readFileSync(path.join(__dirname, 'booksDB.json'), 'utf8');
    parsedData = JSON.parse(data);
} catch (err) {
    console.error('Ошибка при чтении файла:', err);
    process.exit(1); 
}

app.post('/api/user/login', (req, res) => {
    console.log(req.body); 
    res.status(201).send({
        id: '1',
        mail: 'test@example.com'
    });
});


app.get('/api/books', (req, res) => {
    try {
        res.json(parsedData);
    } catch (err) {
        console.error(err);
        res.status(500).send('Ошибка при получении книг.');
    }
});

app.get('/api/books/:id', (req, res) => {
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

app.post('/api/books', async (req, res) => {
    try {
        const { title, description, author, favorite, fileCover, fileName } = req.body;
        const uniqueId = uuid();

        const newBook = {
            id: uniqueId,
            title: title || 'Без названия',
            description: description || 'Описание отсутствует',
            author: author || 'Неизвестный автор',
            favorite: favorite || false,
            fileCover: fileCover || '',
            fileName: fileName || '',
        };

        parsedData.push(newBook);

        await fs.promises.writeFile(path.join(__dirname, 'booksDB.json'), JSON.stringify(parsedData, null, 2));

        res.json({
            message: "Книга добавлена",
            book: newBook
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка при добавлении книги' });
    }
});

app.put('/api/books/:id', async (req, res) => {
try {
    const { id } = req.params;
    updateBook = req.body;
    const bookIndex = parsedData.findIndex((book) => book.id === id);
    if(bookIndex !== -1) {
        parsedData[bookIndex] = {...updateBook, id};
        await fs.promises.writeFile("booksDB.JSON", JSON.stringify(parsedData), "utf8")

            res.json({message: "OK"});
            console.log("Книга изменена");
    }
} catch (error) {
    
}
})

app.delete("/api/books/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const bookIndex = parsedData.findIndex((book) => book.id === id);
        if(bookIndex !== -1) {
            parsedData.splice(bookIndex, 1);

            await fs.promises.writeFile("booksDB.JSON", JSON.stringify(parsedData), "utf8")

            res.json({message: "OK"});
            console.log("Книга удалена");
        } else {
            res.status(404).json({error: "Книга не найдена"});
        }
    } catch (error) {
        console.error(err);
        res.status(500).send('Ошибка при поиске книги.');
    }
})



app.listen(config.PORT, () => {
    console.log(`Порт открыт на ${config.PORT}`);
});