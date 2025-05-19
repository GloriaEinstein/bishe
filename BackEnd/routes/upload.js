import express from 'express';
import { upload } from '../middlewares/upload.js';

const router = express.Router();

// 处理封面图片上传
router.post('/cover', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: '未上传图片'
      });
    }
    
    // 返回图片URL给前端
    res.status(200).json({
      success: true,
      data: {
        url: `/uploads/news/${req.file.filename}`
      }
    });
  } catch (error) {
    console.error('上传图片错误:', error);
    res.status(500).json({
      success: false,
      message: '服务器错误，请稍后重试'
    });
  }
});

export default router;
