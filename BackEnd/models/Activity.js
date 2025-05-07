// bishe8/BackEnd/models/Activity.js
import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '活动标题不能为空'],
  },
  content: {
    type: String,
    required: [true, '活动内容不能为空'],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Activity', activitySchema);
