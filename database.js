import mongoose from 'mongoose';

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Подключено к MongoDB');
  } catch (err) {
    console.error('Ошибка подключения к MongoDB:', err);
    throw err;
  }
};

export default connectToDatabase;