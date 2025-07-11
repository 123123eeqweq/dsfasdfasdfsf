import mongoose from 'mongoose';

const liveSpinSchema = new mongoose.Schema({
  giftId: { type: String, required: true },
  caseId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('LiveSpin', liveSpinSchema);