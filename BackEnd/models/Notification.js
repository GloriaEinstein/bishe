// bishe4/BackEnd/models/Notification.js
import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '通知标题不能为空'],
  },
  content: {
    type: String,
    required: [true, '通知内容不能为空'],
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

export default mongoose.model('Notification', notificationSchema);
