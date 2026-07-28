import {
  Inject,
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { v2 as CloudinaryType } from 'cloudinary';
import sharp from 'sharp';
import * as streamifier from 'streamifier';
import { CLOUDINARY } from './cloudinary.provider';

@Injectable()
export class UploadsService {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinaryType,
  ) {}

  async uploadImage(
    file: Express.Multer.File,
  ): Promise<{ message: string; imageUrl: string }> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    let processedBuffer: Buffer;

    try {
      processedBuffer = await sharp(file.buffer)
        .resize({ width: 800 })
        .jpeg({ quality: 80 })
        .toBuffer();
    } catch {
      throw new BadRequestException(
        'Could not process this image — make sure it is a valid image file',
      );
    }

    try {
      const result = await this.streamUpload(processedBuffer);
      return {
        message: 'Image uploaded successfully.',
        imageUrl: result.secure_url,
      };
    } catch (error) {
      console.error('Cloudinary upload failed:', error);
      throw new InternalServerErrorException(
        'Image upload failed. Please check your connection and try again.',
      );
    }
  }

  private streamUpload(fileBuffer: Buffer): Promise<{ secure_url: string }> {
    return new Promise((resolve, reject) => {
      const stream = this.cloudinary.uploader.upload_stream((error, result) => {
        if (result) {
          resolve(result);
        } else {
          console.error('Cloudinary raw error:', error);
          reject(error instanceof Error ? error : new Error('Upload failed'));
        }
      });
      streamifier.createReadStream(fileBuffer).pipe(stream);
    });
  }
}
