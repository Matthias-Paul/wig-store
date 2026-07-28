import { registerAs } from '@nestjs/config';

export default registerAs('cloudinary', () => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error('Cloudinary environment variables are not fully defined');
  }

  return { cloudName, apiKey, apiSecret };
});
