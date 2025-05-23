import mongoose from 'mongoose';

const userNewsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  newsId: { type: mongoose.Schema.Types.ObjectId, ref: 'News', required: true },
  interactionType: { type: String, enum: ['view', 'like', 'share', 'comment'], default: 'view' },
  interactionTime: { type: Date, default: Date.now }
});

export default mongoose.model('UserNews', userNewsSchema);