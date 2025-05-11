<template>
  <div class="activity-publish">
    <el-card>
      <h2>活动发布</h2>
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="简介">
          <el-input
            v-model="form.introduction"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10 }"
            class="auto-resize-textarea"
            maxlength="15"
          />
        </el-form-item>
        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 10 }"
            class="auto-resize-textarea"
          />
        </el-form-item>
        <el-form-item label="活动区域">
          <el-select v-model="form.activityArea" placeholder="请选择活动区域">
            <el-option label="校内" value="校内"></el-option>
            <el-option label="校外" value="校外"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务类别">
          <el-select v-model="form.serviceType" placeholder="请选择服务类别">
            <el-option label="社区服务" value="社区服务"></el-option>
            <el-option label="支教助学" value="支教助学"></el-option>
            <el-option label="扶贫减贫" value="扶贫减贫"></el-option>
            <el-option label="卫生健康" value="卫生健康"></el-option>
            <el-option label="环境保护" value="环境保护"></el-option>
            <el-option label="文化艺术" value="文化艺术"></el-option>
            <el-option label="禁毒宣传" value="禁毒宣传"></el-option>
            <el-option label="关爱特殊群体" value="关爱特殊群体"></el-option>
            <el-option label="大型活动" value="大型活动"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务对象">
          <el-select v-model="form.serviceTarget" placeholder="请选择服务对象">
            <el-option label="儿童" value="儿童"></el-option>
            <el-option label="妇女" value="妇女"></el-option>
            <el-option label="老年人" value="老年人"></el-option>
            <el-option label="残障人士" value="残障人士"></el-option>
            <el-option label="贫困家庭" value="贫困家庭"></el-option>
            <el-option label="其它" value="其它"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="项目人数">
          <el-input v-model.number="form.participantCount" type="number" />
        </el-form-item>
        <el-form-item label="活动开始时间">
          <el-date-picker
            v-model="form.startTime"
            type="datetime"
            placeholder="选择活动开始时间"
            :picker-options="startTimePickerOptions"
          />
        </el-form-item>
        <el-form-item label="活动结束时间">
          <el-date-picker
            v-model="form.endTime"
            type="datetime"
            placeholder="选择活动结束时间"
            :picker-options="endTimePickerOptions"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlePublish">发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import api from '@/api'

export default {
  name: 'ActivityPublish',
  data() {
    return {
      form: {
        title: '',
        introduction: '', // 新增简介字段
        content: '',
        activityArea: '',
        serviceType: '',
        serviceTarget: '',
        participantCount: 0,
        startTime: null,
        endTime: null
      },
      rules: {
        startTime: [
          {
            validator: (rule, value, callback) => {
              if (value && new Date(value) < new Date()) {
                callback(new Error('开始时间不能早于当前时间'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ],
        endTime: [
          {
            validator: (rule, value, callback) => {
              if (this.form.startTime && value && new Date(value) < new Date(this.form.startTime)) {
                callback(new Error('结束时间不能早于开始时间'));
              } else {
                callback();
              }
            },
            trigger: 'change'
          }
        ]
      },
      startTimePickerOptions: {
        disabledDate: (time) => {
          return time.getTime() < Date.now() - 8.64e7;
        }
      },
      endTimePickerOptions: {
        disabledDate: (time) => {
          if (this.form.startTime) {
            return time.getTime() < new Date(this.form.startTime).getTime();
          }
          return false;
        }
      }
    }
  },
  methods: {
    async handlePublish() {
      try {
        await api.activity.publish(this.form);
        this.$message.success('活动发布成功');
        this.form.title = '';
        this.form.introduction = ''; // 清空简介字段
        this.form.content = '';
        this.form.activityArea = '';
        this.form.serviceType = '';
        this.form.serviceTarget = '';
        this.form.participantCount = 0;
        this.form.startTime = null;
        this.form.endTime = null;
      } catch (error) {
        this.$message.error('活动发布失败');
      }
    }
  }
}
</script>

<style scoped>
.activity-publish {
  max-width: 800px;
  margin: 0 auto;
  padding: 30px 20px;
}

.el-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.el-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

h2 {
  text-align: center;
  margin-bottom: 30px;
  color: #303133;
  font-size: 24px;
  font-weight: 600;
  position: relative;
  padding-bottom: 10px;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background-color: #409eff;
  border-radius: 2px;
}

.el-form {
  padding: 0 40px;
}

.el-form-item {
  margin-bottom: 22px;
}

.el-form-item:last-child {
  margin-top: 32px;
  display: flex;
  justify-content: flex-end;
}

.el-input,
.el-textarea {
  border-radius: 8px;
}

.el-input ::v-deep .el-input__inner,
.el-textarea ::v-deep .el-textarea__inner {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-input ::v-deep .el-input__inner:focus,
.el-textarea ::v-deep .el-textarea__inner:focus {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.el-button {
  padding: 10px 24px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.el-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);
}

/* 内容栏弹性调整样式 */
.auto-resize-textarea ::v-deep .el-textarea__inner {
  min-height: 120px !important;
  max-height: 400px;
  height: auto !important;
  resize: none;
  line-height: 1.6;
  padding: 12px 16px;
  white-space: pre-wrap;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .el-form {
    padding: 0 20px;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 25px;
  }

  .auto-resize-textarea ::v-deep .el-textarea__inner {
    min-height: 100px;
  }
}
</style>
