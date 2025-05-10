// bishe10/BackEnd/models/Activity.js
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
  area: {
    type: String,
    enum: ['校内', '校外']
  },
  serviceType: {
    type: String,
    enum: ['社区服务', '支教助学', '扶贫减贫', '卫生健康', '环境保护', '文化艺术', '禁毒宣传', '关爱特殊群体', '大型活动', '其它']
  },
  projectStatus: {
    type: String,
    enum: ['待启动', '运行中', '已结项']
  },
  serviceTarget: {
    type: String,
    enum: ['儿童', '妇女', '老年人', '残障人士', '贫困家庭', '其它']
  },
  participantCount: {
    type: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Activity', activitySchema);
