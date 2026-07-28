import { Provider } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import type { ConfigType } from '@nestjs/config';
import cloudinaryConfig from '../config/cloudinary.config';

export const CLOUDINARY = 'CLOUDINARY';

export const CloudinaryProvider: Provider = {
  provide: CLOUDINARY,
  inject: [cloudinaryConfig.KEY],
  useFactory: (config: ConfigType<typeof cloudinaryConfig>) => {
    cloudinary.config({
      cloud_name: config.cloudName,
      api_key: config.apiKey,
      api_secret: config.apiSecret,
    });
    return cloudinary;
  },
};
