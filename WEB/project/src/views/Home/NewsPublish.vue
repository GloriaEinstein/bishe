<template>
  <div class="news-publish">
    <el-card>
      <h2>新闻发布</h2>
      <el-form :model="form" :rules="rules" ref="newsForm" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="form.category" placeholder="请选择新闻分类">
            <el-option label="校园动态" value="校园动态"></el-option>
            <el-option label="学术科研" value="学术科研"></el-option>
            <el-option label="文体活动" value="文体活动"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签" prop="tags">
          <el-input v-model="form.tags" placeholder="多个标签用逗号分隔"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <quill-editor
            v-model="form.content"
            ref="editor"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="发布时间" prop="publishTime">
          <el-date-picker
            v-model="form.publishTime"
            type="datetime"
            placeholder="选择发布时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlePreview">预览</el-button>
          <el-button type="primary" @click="handlePublish">发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-dialog :visible.sync="previewVisible" title="新闻预览">
      <div class="preview-content">
        <h3>{{ form.title }}</h3>
        <p class="preview-meta">
          <span>分类：{{ form.category }}</span>
          <span class="ml-4">标签：{{ form.tags }}</span>
        </p>
        <div class="preview-body" v-html="form.content"></div>
        <p class="preview-meta">发布时间：{{ formattedPublishTime }}</p>
      </div>
      <template #footer>
        <el-button @click="previewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import api from '@/api'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'NewsPublish',
  components: {
    quillEditor
  },
  data() {
    return {
      form: {
        title: '',
        category: '',
        tags: '',
        content: '',
        publishTime: null
      },
      previewVisible: false,
      editorOption: {
        theme: 'snow',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'script': 'sub' }, { 'script': 'super' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            [{ 'direction': 'rtl' }],
            [{ 'size': ['small', false, 'large', 'huge'] }],
            [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
            [{ 'color': [] }, { 'background': [] }],
            [{ 'font': [] }],
            [{ 'align': [] }],
            ['clean'],
            ['link', 'image', 'video']
          ]
        }
      },
      rules: {
        title: [
          { required: true, message: '新闻标题不能为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '新闻内容不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    formattedPublishTime() {
      if (!this.form.publishTime) return '立即发布'
      const date = new Date(this.form.publishTime)
      return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
    }
  },
  methods: {
    async handlePublish() {
      this.$refs.newsForm.validate(async (valid) => {
        if (valid) {
          try {
            if (!this.form.publishTime) {
              this.form.publishTime = new Date().toISOString()
            }
            await api.news.publishNews(this.form)
            this.$message.success('新闻发布成功')
            this.resetForm()
          } catch (error) {
            this.$message.error('新闻发布失败')
          }
        } else {
          this.$message.error('请填写必要信息')
        }
      })
    },
    handlePreview() {
      const hasContent = this.form.content.replace(/<[^>]+>/g, '').trim().length > 0
      if (!hasContent) {
        this.$message.warning('请先输入新闻内容')
        return
      }
      this.previewVisible = true
    },
    resetForm() {
      this.$refs.newsForm.resetFields()
      this.form.content = ''
    }
  }
}
</script>

<style scoped>
.news-publish {
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

.preview-content {
  padding: 20px;
  border: 1px solid #ebeef5;
  border-radius: 8px;
  background-color: #fafafa;
}

.preview-body >>> .ql-editor {
  padding: 0;
  background: white;
}

.preview-body img {
  max-width: 100%;
  margin: 10px 0;
}

@media (max-width: 768px) {
  .el-form {
    padding: 0 20px;
  }

  h2 {
    font-size: 20px;
    margin-bottom: 25px;
  }
}
</style>