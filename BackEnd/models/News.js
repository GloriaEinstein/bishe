import mongoose from 'mongoose';

const newsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '新闻标题不能为空'],
    trim: true
  },
  content: {
    type: String,
    required: [true, '新闻内容不能为空'],
    trim: true
  },
  category: {
    type: String,
    default: '',
    enum: ['校园动态', '学术科研', '文体活动']
  },
  tags: {
    type: String,
    default: ''
  },
  publishTime: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('News', newsSchema);