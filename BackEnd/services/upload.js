// server/services/upload.js
import sharp from 'sharp';
import path from 'path';
import fs from 'fs/promises'; // 使用 fs/promises 进行异步操作
import config from '../config/index.js'; // 导入配置

export const processAvatar = async (buffer, userId, oldAvatarRelativePath) => {
  // 定义基础上传目录，与 config/index.js 中的 avatarAbsolutePath 保持一致
  const baseUploadDir = config.upload.avatarAbsolutePath;

  // 1. 删除原头像 (异步且更安全)
  // 只有当旧头像不是默认头像时才尝试删除
  if (oldAvatarRelativePath && oldAvatarRelativePath!== config.upload.avatarRelativePathBase + '/default.png') {
    // 从相对路径中提取文件名，并构建完整的文件系统路径
    const oldFilename = path.basename(oldAvatarRelativePath);
    const fullOldAvatarFilePath = path.join(baseUploadDir, oldFilename);

    try {
      // 检查文件是否存在并删除
      await fs.access(fullOldAvatarFilePath, fs.constants.F_OK); // 检查文件是否存在
      await fs.unlink(fullOldAvatarFilePath);
      console.log(`[Avatar Service] 旧头像 ${fullOldAvatarFilePath} 已删除.`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        console.warn(`[Avatar Service] 旧头像 ${fullOldAvatarFilePath} 不存在，无需删除.`);
      } else {
        console.error(`[Avatar Service] 删除旧头像 ${fullOldAvatarFilePath} 失败:`, error);
        // 如果删除失败，为了不中断新头像上传，这里暂时只打印错误，不抛出
      }
    }
  }

  // 2. 处理新头像
  const filename = `avatar-${userId}-${Date.now()}.webp`;
  const newAvatarFullSavePath = path.join(baseUploadDir, filename); // 新头像的完整保存路径

  try {
    // 确保上传目录存在，如果不存在则递归创建
    await fs.mkdir(baseUploadDir, { recursive: true });

    // 使用 sharp 处理图片 (resize, convert to webp) 并保存到文件
    await sharp(buffer)
      .resize(200, 200, {
        fit: sharp.fit.cover, // 覆盖模式，裁剪以适应尺寸
        position: sharp.strategy.entropy // 智能裁剪，保留图像中最“有趣”的部分
      })
      .webp({ quality: 80 }) // 转换为 WebP 格式，质量 80
      .toFile(newAvatarFullSavePath);

    console.log(`[Avatar Service] 新头像已保存到: ${newAvatarFullSavePath}`);

    // 返回新头像的相对路径，用于存储到数据库和前端显示
    return `${config.upload.avatarRelativePathBase}/${filename}`;

  } catch (error) {
    console.error(`[Avatar Service] 处理或保存新头像失败:`, error);
    throw new Error('头像处理失败。'); // 抛出错误以便路由层捕获
  }
};
