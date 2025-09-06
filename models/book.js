import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  authors: { type: String },
  favorite: Boolean,
  fileCover: String,
  fileName: String,
  viewCount: { type: Number, default: 0 },
});

const BookModel = mongoose.model('Book', bookSchema);

export { BookModel };