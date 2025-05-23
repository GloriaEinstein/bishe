// bishe44/BackEnd/models/NewsKeywords.js
import mongoose from 'mongoose';

const newsKeywordsSchema = new mongoose.Schema({
  newsId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'News',
    required: true
  },
  keywords: {
    type: [String],
    required: true
  }
});

export default mongoose.model('NewsKeywords', newsKeywordsSchema);
