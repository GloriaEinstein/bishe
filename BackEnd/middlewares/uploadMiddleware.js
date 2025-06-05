// server/middlewares/uploadMiddleware.js
import multer from 'multer';

// 配置 Multer 使用 memoryStorage
// memoryStorage 将文件作为 Buffer 存储在内存中
// 这对于小型文件（如头像）很有用，可以直接在内存中进行 Sharp 处理，而无需先写入磁盘。
const storage = multer.memoryStorage();

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 限制文件大小为 5MB (可根据需求调整)
  },
  fileFilter: (req, file, cb) => {
    // 允许的图片 MIME 类型
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true); // 允许上传
    } else {
      // 拒绝上传，并提供错误信息
      cb(new Error('不允许的文件类型！只允许 JPG, PNG, WebP 或 GIF 格式的图片。'), false);
    }
  }
});

export default upload; // 导出配置好的 Multer 实例