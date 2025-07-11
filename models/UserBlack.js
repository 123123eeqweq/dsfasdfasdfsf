import mongoose from 'mongoose';

const userBlackSchema = new mongoose.Schema({
  telegramId: { type: String, required: true, unique: true },
});

export default mongoose.model('UserBlack', userBlackSchema);