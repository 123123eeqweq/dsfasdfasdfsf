import mongoose from 'mongoose';

const caseSchema = new mongoose.Schema({
  caseId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  diamondPrice: { type: Number, default: 0 },
  isTopup: { type: Boolean, default: false },
  isReferral: { type: Boolean, default: false }, 
  items: [
    {
      giftId: { type: String, required: true },
      probability: { type: Number, required: true },
    },
  ],
});

export default mongoose.model('Case', caseSchema);