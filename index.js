import express from 'express';
import indexRouter from "./routes/index.js"
import bookRouter from "./routes/books.js"
import methodOverride  from 'method-override';

const app = express();
app.use(methodOverride('_method'));


app.use(express.urlencoded())
app.use(express.json());
app.set("view engine", "ejs")
app.use(express.static('public'));

app.use('/', indexRouter)
app.use('/api/books', bookRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});