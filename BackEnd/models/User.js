import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, '用户名不能为空'],
    unique: true,
    trim: true,
    minlength: [3, '用户名至少3个字符']
  },
  password: {
    type: String,
    required: [true, '密码不能为空'],
    minlength: [6, '密码至少6个字符'],
    select: false
  },
  name: {
    type: String,
    default: '新用户'
  },
  avatar: {
    type: String,
    default: '/uploads/avatar/default.png'
  },
  studentId: {
    type: String
  },
  college: {
    type: String
  },
  major: {
    type: String
  },
  email: {
    type: String,
    validate: {
      validator: function(v) {
        return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
      },
      message: props => `${props.value} 不是有效的邮箱地址！`
    }
  },
  signature: {
    type: String,
    default: '这个用户很懒，什么都没写'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  userType: {
    type: String,
    enum: ['volunteer', 'schoolOrganization', 'admin','offCampusOrganization'],
    default: 'volunteer'
  },
  isVerified: {
    type: Boolean,
    default: false
  }
});

// 密码加密中间件
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(new Error('密码加密失败'));
  }
});

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  delete user.__v;
  return user;
};

export default mongoose.model('User', userSchema);
