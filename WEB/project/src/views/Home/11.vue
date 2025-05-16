<template>
  <div class="activity-publish">
    <!-- 装饰性边框 -->
    <div class="decorative-border top-left"></div>
    <div class="decorative-border bottom-right"></div>

    <!-- 动态背景 -->
    <div class="animated-background"></div>

    <el-card class="vintage-card">
      <!-- 标题装饰区 -->
      <div class="embossed-header">
        <div class="laurel left"></div>
        <i class="el-icon-trophy title-icon"></i>
        <h2>活动发布</h2>
        <div class="laurel right"></div>
      </div>

      <el-form 
        :model="form" 
        label-width="100px"
        class="golden-form"
      >
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>

        <el-form-item label="简介">
          <el-input
            v-model="form.introduction"
            type="textarea"
            :autosize="{ minRows: 3, maxRows: 5 }"
            maxlength="150"
          />
        </el-form-item>

        <el-form-item label="内容">
          <el-input
            v-model="form.content"
            type="textarea"
            :autosize="{ minRows: 4, maxRows: 8 }"
          />
        </el-form-item>

        <el-form-item label="活动区域">
          <el-select 
            v-model="form.activityArea" 
            placeholder="请选择活动区域"
            class="gold-select"
          >
            <el-option label="校内" value="校内"></el-option>
            <el-option label="校外" value="校外"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="服务类别">
          <el-select 
            v-model="form.serviceType" 
            placeholder="请选择服务类别"
            class="gold-select"
          >
            <!-- 选项列表保持不变 -->
          </el-select>
        </el-form-item>

        <el-form-item label="服务对象">
          <el-select 
            v-model="form.serviceTarget" 
            placeholder="请选择服务对象"
            class="gold-select"
          >
            <!-- 选项列表保持不变 -->
          </el-select>
        </el-form-item>

        <el-form-item label="项目人数">
          <el-input 
            v-model.number="form.participantCount" 
            type="number"
            class="gold-input"
          />
        </el-form-item>

        <el-form-item label="活动时间">
          <div class="date-picker-group">
            <el-date-picker
              v-model="form.startTime"
              type="datetime"
              placeholder="开始时间"
              class="gold-date-picker"
              :picker-options="startTimePickerOptions"
            />
            <span class="time-separator">至</span>
            <el-date-picker
              v-model="form.endTime"
              type="datetime"
              placeholder="结束时间"
              class="gold-date-picker"
              :picker-options="endTimePickerOptions"
            />
          </div>
        </el-form-item>

        <el-form-item>
          <el-button 
            type="primary" 
            class="gold-button"
            @click="handlePublish"
          >
            <i class="el-icon-magic-stick"></i>
            发布活动
          </el-button>
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
        introduction: '',
        content: '',
        activityArea: '',
        serviceType: '',
        serviceTarget: '',
        participantCount: 0,
        startTime: null,
        endTime: null
      },
      rules: {
        // 验证规则保持不变
      },
      startTimePickerOptions: {
        // 时间选择配置保持不变
      },
      endTimePickerOptions: {
        // 时间选择配置保持不变
      }
    }
  },
  methods: {
    async handlePublish() {
      try {
        await api.activity.publish(this.form);
        this.$message.success('活动发布成功');
        // 清空表单代码保持不变
      } catch (error) {
        this.$message.error('活动发布失败');
      }
    }
  }
}
</script>

<style scoped>
.activity-publish {
  position: relative;
  min-height: 100vh;
  background: 
    linear-gradient(135deg, #fff9f0 0%, #fff3e6 100%),
    repeating-linear-gradient(45deg, 
      transparent 0px,
      transparent 24px,
      rgba(255,215,0,0.08) 24px,
      rgba(255,215,0,0.08) 28px
    );
  padding: 60px 20px;
  overflow: hidden;
}

/* 鎏金边框装饰 */
.decorative-border {
  position: absolute;
  width: 120px;
  height: 120px;
  border: 3px solid #ffd700;
  opacity: 0.3;
  pointer-events: none;
}

.top-left {
  top: 20px;
  left: 20px;
  border-right: none;
  border-bottom: none;
}

.bottom-right {
  bottom: 20px;
  right: 20px;
  border-left: none;
  border-top: none;
}

/* 动态背景 */
.animated-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: 
    radial-gradient(circle at 20% 80%, rgba(255,215,0,0.05) 0%, transparent 40%),
    radial-gradient(circle at 80% 20%, rgba(255,215,0,0.05) 0%, transparent 40%);
  animation: particle-flow 20s linear infinite;
  z-index: 0;
}

@keyframes particle-flow {
  0% { background-position: 0% 0%, 100% 100%; }
  100% { background-position: 100% 100%, 0% 0%; }
}

/* 复古卡片 */
.vintage-card {
  position: relative;
  background: #fffaf3 !important;
  border: 2px solid #ffe7ba;
  border-radius: 16px;
  box-shadow: 
    0 8px 32px rgba(139, 69, 19, 0.1),
    inset 0 0 20px rgba(255,215,0,0.05);
  max-width: 900px;
  margin: 0 auto;
  overflow: visible;
  transition: transform 0.3s ease;
  z-index: 1;
}

.vintage-card:hover {
  transform: translateY(-5px);
}

.vintage-card::before {
  content: '';
  position: absolute;
  inset: -6px;
  background: linear-gradient(
    135deg,
    rgba(255,215,0,0.2) 0%,
    rgba(255,215,0,0) 40%
  );
  z-index: -1;
  border-radius: 20px;
}

/* 标题装饰 */
.embossed-header {
  position: relative;
  padding: 30px 0;
  margin: 0 40px 40px;
  background: 
    linear-gradient(to right, 
      rgba(255,215,0,0.1) 0%,
      rgba(255,215,0,0.2) 50%,
      rgba(255,215,0,0.1) 100%
    );
  box-shadow: 
    inset 0 2px 4px rgba(255,215,0,0.2),
    inset 0 -2px 4px rgba(255,215,0,0.1);
  border-radius: 8px;
}

.embossed-header h2 {
  font-family: 'Microsoft YaHei', sans-serif;
  color: #8b4513;
  text-shadow: 
    1px 1px 0px #fff, 
    -1px -1px 0px rgba(0,0,0,0.1);
  letter-spacing: 2px;
  font-size: 28px;
  margin: 0;
  text-align: center;
}

.embossed-header h2::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 2px;
  background: #d4af37;
}

.title-icon {
  position: absolute;
  left: 50%;
  top: -28px;
  transform: translateX(-50%);
  font-size: 48px;
  color: #d4af37;
  background: #fffaf3;
  padding: 8px;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 2;
}

/* 月桂叶装饰 */
.laurel {
  position: absolute;
  top: 50%;
  width: 80px;
  height: 100px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3E%3Cpath fill='%23d4af37' d='M12 2.../%3E%3C/svg%3E");
  opacity: 0.6;
  transform: translateY(-50%);
}

.laurel.left {
  left: -40px;
  transform: translateY(-50%) scaleX(-1);
}

.laurel.right {
  right: -40px;
}

/* 表单美化 */
.golden-form {
  padding: 0 40px;
}

.el-form-item__label {
  color: #8b4513 !important;
  font-weight: 500;
  letter-spacing: 1px;
  font-size: 15px;
}

/* 输入框样式 */
.el-input ::v-deep .el-input__inner,
.el-textarea ::v-deep .el-textarea__inner {
  background: #fffdf9;
  border: 1px solid #ffe7ba;
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
  transition: all 0.3s ease;
  border-radius: 8px;
  color: #664d30;
}

.el-input ::v-deep .el-input__inner:focus,
.el-textarea ::v-deep .el-textarea__inner:focus {
  border-color: #d4af37;
  box-shadow: 0 0 8px rgba(212,175,55,0.2);
}

/* 下拉选择器 */
.gold-select ::v-deep .el-input__inner {
  background-image: 
    linear-gradient(45deg, transparent 50%, #d4af37 50%),
    linear-gradient(135deg, #d4af37 50%, transparent 50%);
  background-position: calc(100% - 15px) 50%, calc(100% - 10px) 50%;
  background-size: 5px 5px, 5px 5px;
  background-repeat: no-repeat;
}

/* 日期选择器 */
.gold-date-picker ::v-deep .el-input__inner {
  width: 220px;
}
.date-picker-group {
  display: flex;
  align-items: center;
  gap: 15px;
}
.time-separator {
  color: #8b4513;
  font-weight: 500;
}

/* 金色按钮 */
.gold-button {
  background: linear-gradient(135deg, #d4af37, #b8860b);
  border: none;
  border-radius: 24px;
  padding: 12px 36px;
  font-size: 16px;
  letter-spacing: 2px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.gold-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(212,175,55,0.3);
}

.gold-button::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    45deg,
    transparent 25%,
    rgba(255,255,255,0.3) 50%,
    transparent 75%
  );
  animation: shine 2s infinite;
}

@keyframes shine {
  100% {
    background-position: 200% center;
  }
}

/* 响应式适配 */
@media (max-width: 768px) {
  .vintage-card {
    margin: 0 10px;
  }
  
  .embossed-header {
    margin: 0 20px 30px;
    padding: 20px 0;
  }
  
  .laurel {
    display: none;
  }
  
  .el-form {
    padding: 0 20px;
  }
  
  .date-picker-group {
    flex-direction: column;
  }
  
  .gold-date-picker ::v-deep .el-input__inner {
    width: 100%;
  }
}
</style>