import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import config from '../config/index.js';

export const processAvatar = async (buffer, userId, oldAvatarPath) => {
  // 删除原头像
  if (oldAvatarPath && oldAvatarPath!== '/uploads/avatar/default.png') {
    const oldPath = path.join(process.cwd(), oldAvatarPath.replace('/uploads/avatar/', ''));
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  const filename = `avatar-${userId}-${Date.now()}.webp`;
  const outputPath = path.join(config.upload.avatarPath, filename);

  await sharp(buffer)
    .resize(200, 200)
    .webp({ quality: 80 })
    .toFile(outputPath);

  return `/uploads/avatar/${filename}`;
};
