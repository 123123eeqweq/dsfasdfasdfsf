import mongoose from 'mongoose';

const giftSchema = new mongoose.Schema({
  giftId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
});

export default mongoose.model('Gift', giftSchema);