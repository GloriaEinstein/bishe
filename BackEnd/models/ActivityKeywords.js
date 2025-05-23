// bishe44/BackEnd/models/ActivityKeywords.js
import mongoose from 'mongoose';

const activityKeywordsSchema = new mongoose.Schema({
  activityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Activity',
    required: true
  },
  keywords: {
    type: [String],
    required: true
  }
});

export default mongoose.model('ActivityKeywords', activityKeywordsSchema);
