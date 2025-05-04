<template>
  <div class="auth-container">
    <transition name="fade">
      <el-card class="auth-card">
        <h2 class="auth-title">大学生志愿者管理系统</h2>
        <div class="auth-switch">
          <el-button :type="isLogin ? 'primary' : 'default'" @click="toggleForm(true)">登录</el-button>
          <el-button :type="!isLogin ? 'primary' : 'default'" @click="toggleForm(false)">注册</el-button>
        </div>

        <el-form ref="form" :model="form" :rules="rules" @submit.native.prevent>
          <el-form-item label="用户名" prop="username">
            <el-input v-model="form.username" placeholder="请输入用户名"/>
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input v-model="form.password" type="password" placeholder="请输入密码"/>
          </el-form-item>

          <el-form-item v-if="!isLogin" label="确认密码" prop="confirmPassword">
            <el-input v-model="form.confirmPassword" type="password" placeholder="请再次输入密码"/>
          </el-form-item>

          <el-form-item v-if="!isLogin" label="用户类型" prop="userType">
            <el-select v-model="form.userType" placeholder="请选择用户类型">
              <el-option label="志愿者" value="志愿者"></el-option>
              <el-option label="校组织" value="校组织"></el-option>
            </el-select>
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              :loading="loading"
              @click="handleSubmit"
              native-type="submit"
            >
              {{ isLogin ? '登录' : '注册' }}
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </transition>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'AuthLogin',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value !== this.form.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };

    return {
      isLogin: true,
      loading: false,
      form: {
        username: '',
        password: '',
        confirmPassword: '',
        userType: '志愿者'
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, message: '用户名至少3个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { min: 6, message: '密码至少6位', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    ...mapActions('user', ['login', 'register']),
    
    toggleForm(isLogin) {
      this.isLogin = isLogin;
      this.$refs.form.resetFields();
    },

    async handleSubmit() {
      try {
        this.loading = true;
        await this.$refs.form.validate();
        
        const action = this.isLogin ? 'login' : 'register';
        await this[action](this.form);
        
        this.$message.success('登录成功！');
        this.$router.push(this.$route.query.redirect || '/');
      } catch (error) {
        // 处理错误
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
}

.auth-card {
  width: 400px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  background: white;
}

.auth-title {
  text-align: center;
  margin-bottom: 20px;
  color: #1890ff;
  font-size: 1.8rem;
}

.auth-switch {
  margin-bottom: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  gap: 10px;
}

.el-form-item__content {
  display: flex;
  justify-content: center;
}

/* 过渡动画样式 */
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>