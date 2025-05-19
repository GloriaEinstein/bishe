<template>
  <div class="news-publish">
    <el-card>
      <h2>新闻发布</h2>
      <el-form :model="form" label-width="80px">
        <el-form-item label="标题">
          <el-input v-model="form.title" />
        </el-form-item>
        <el-form-item label="封面图片">
          <el-upload
            class="upload-demo"
            :action="uploadUrl"
            :before-upload="beforeUpload"
            :on-success="handleCoverUploadSuccess"
            :on-error="handleCoverUploadError"
            :show-file-list="false"
            :headers="headers"
            :auto-upload="true"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过5MB</div>
          </el-upload>
          <div v-if="form.coverImage" class="preview-container">
            <img :src="form.coverImage" alt="封面图片" class="preview-image">
            <el-button size="mini" type="danger" @click="removeCover">删除</el-button>
          </div>
        </el-form-item>
        <el-form-item label="分类">
          <el-select v-model="form.category" placeholder="请选择新闻分类">
            <el-option label="校园动态" value="校园动态"></el-option>
            <el-option label="学术科研" value="学术科研"></el-option>
            <el-option label="文体活动" value="文体活动"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标签">
          <el-input v-model="form.tags" placeholder="多个标签用逗号分隔"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <quill-editor
            v-model="form.content"
            ref="editor"
            :options="editorOption"
          ></quill-editor>
        </el-form-item>
        <el-form-item label="发布时间">
          <el-date-picker
            v-model="form.publishTime"
            type="datetime"
            placeholder="选择发布时间"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handlePublish">发布</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { quillEditor } from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

export default {
  name: 'NewsPublish',
  components: {
    quillEditor
  },
  data() {
    return {
      form: {
        title: '',
        coverImage: '',
        category: '',
        tags: '',
        content: '',
        publishTime: null
      },
      uploadUrl: 'http://localhost:3000/api/upload/cover',
      headers: {
        // 如果需要身份验证，添加相应的请求头
      },
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
      }
    }
  },
  methods: {
    beforeUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt5M = file.size / 1024 / 1024 < 5
      
      if (!isJPG) {
        this.$message.error('只能上传jpg/png文件')
        return false
      }
      
      if (!isLt5M) {
        this.$message.error('图片大小不能超过5MB')
        return false
      }
      
      return true
    },
    
    handleCoverUploadSuccess(response, file, fileList) {
      if (response.success) {
        this.form.coverImage = response.data.url
        this.$message.success('封面图片上传成功')
      } else {
        this.$message.error(response.message || '封面图片上传失败')
      }
    },
    
    handleCoverUploadError(error) {
      this.$message.error('封面图片上传失败')
      console.error('封面上传错误:', error)
    },
    
    removeCover() {
      this.form.coverImage = ''
    },
    
    async handlePublish() {
      try {
        // 表单验证
        if (!this.form.title) {
          this.$message.error('请输入新闻标题')
          return
        }
        
        if (!this.form.content) {
          this.$message.error('请输入新闻内容')
          return
        }
        
        if (!this.form.coverImage) {
          this.$message.error('请上传封面图片')
          return
        }
        
        // 提交所有新闻数据
        const response = await this.$axios.post(
          'http://localhost:3000/api/news/publish',
          this.form
        )
        
        if (response.data.success) {
          this.$message.success('新闻发布成功')
          this.resetForm()
        } else {
          this.$message.error(response.data.message || '新闻发布失败')
        }
      } catch (error) {
        this.$message.error('新闻发布失败')
        console.error('发布新闻错误:', error)
      }
    },
    
    resetForm() {
      this.form = {
        title: '',
        coverImage: '',
        category: '',
        tags: '',
        content: '',
        publishTime: null
      }
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

.preview-container {
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.preview-image {
  max-width: 200px;
  max-height: 150px;
  object-fit: contain;
  border-radius: 4px;
  border: 1px solid #ebeef5;
}
</style>
