// bishe8/BackEnd/models/News.js
import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '新闻标题不能为空'],
  },
  content: {
    type: String,
    required: [true, '新闻内容不能为空'],
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('News', newsSchema);
