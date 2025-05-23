import mongoose from 'mongoose';

const userActivitySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  activityId: { type: mongoose.Schema.Types.ObjectId, ref: 'Activity', required: true },
  interactionType: { type: String, enum: ['view', 'like', 'share', 'comment'], default: 'view' },
  interactionTime: { type: Date, default: Date.now }
});

export default mongoose.model('UserActivity', userActivitySchema);