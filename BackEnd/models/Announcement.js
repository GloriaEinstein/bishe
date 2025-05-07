// bishe8/BackEnd/models/Announcement.js
import mongoose from 'mongoose';

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '公告标题不能为空'],
  },
  content: {
    type: String,
    required: [true, '公告内容不能为空'],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Announcement', announcementSchema);
