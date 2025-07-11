import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
  telegramId: { type: String, required: true },
  amount: { type: Number, required: true },
  starsAdded: { type: Number, required: true },
  currency: { type: String, enum: ['STARS', 'TON'], required: true },
  transactionId: { type: String },
  createdAt: { type: Date, default: Date.now },
});

depositSchema.index({ telegramId: 1, transactionId: 1 });

export default mongoose.model('Deposit', depositSchema);