import sharp from 'sharp'
import path from 'path'  // 添加导入
import config from '../config/index.js'

export const processAvatar = async (buffer, userId) => {
  const filename = `avatar-${userId}-${Date.now()}.webp`
  const outputPath = path.join(config.upload.avatarPath, filename)

  await sharp(buffer)
    .resize(200, 200)
    .webp({ quality: 80 })
    .toFile(outputPath)

  return `/uploads/avatar/${filename}`
}