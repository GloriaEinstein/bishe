// bishe10/BackEnd/models/Activity.js
import mongoose from 'mongoose';

const CounterSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 0 }
});

const Counter = mongoose.model('Counter', CounterSchema);

const activitySchema = new mongoose.Schema({
  aID: {
    type: Number,
    unique: true
  },
  title: {
    type: String,
    required: [true, '活动标题不能为空'],
  },
  introduction: { // 新增简介字段
    type: String,
    required: [true, '活动简介不能为空'],
  },
  content: {
    type: String,
    required: [true, '活动内容不能为空'],
  },
  activityArea: {
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
    enum: ['儿童', '妇女', '老年人', '残障人士', '贫困家庭', '特殊群体','其它']
  },
  participantCount: {
    type: Number
  },
  registeredUsers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now
  },
  startTime: {
    type: Date,
  },
  endTime: {
    type: Date,
  },
  username: {
    type: String,
    required: [true, '发布活动的用户姓名不能为空']
  },
  name: {
    type: String,
    required: [true, '发布活动的用户姓名不能为空']
  },
  avatar: {
    type: String,
    required: [true, '发布活动的用户头像不能为空']
  },
});

activitySchema.pre('save', async function(next) {
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: 'activity_aID' },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.aID = counter.seq;
    next();
  } catch (error) {
    next(error);
  }
});

activitySchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (doc, ret) => {
    ret.id = ret._id.toString(); // 将_id转换为字符串并重命名为id
    delete ret._id;
    return ret;
  }
});

export default mongoose.model('Activity', activitySchema);
