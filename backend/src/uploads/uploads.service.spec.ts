import { Test, TestingModule } from '@nestjs/testing';
import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import sharp from 'sharp';
import { UploadsService } from './uploads.service';
import { CLOUDINARY } from './cloudinary.provider';

const sharpToBuffer = jest.fn();

jest.mock('sharp', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    resize: jest.fn().mockReturnThis(),
    jpeg: jest.fn().mockReturnThis(),
    toBuffer: sharpToBuffer,
  })),
}));

jest.mock('streamifier', () => ({
  createReadStream: jest.fn(() => ({
    pipe: jest.fn((uploadStream: { end?: jest.Mock }) => {
      uploadStream.end?.();
      return uploadStream;
    }),
  })),
}));

describe('UploadsService', () => {
  let service: UploadsService;
  let uploadStreamCallback: (
    error: Error | undefined,
    result: { secure_url: string } | undefined,
  ) => void;
  let cloudinary: {
    uploader: {
      upload_stream: jest.Mock;
    };
  };

  const file = {
    buffer: Buffer.from('image-bytes'),
    originalname: 'photo.jpg',
  } as Express.Multer.File;

  beforeEach(async () => {
    sharpToBuffer.mockReset();
    (sharp as unknown as jest.Mock).mockClear();

    cloudinary = {
      uploader: {
        upload_stream: jest.fn((callback) => {
          uploadStreamCallback = callback;
          return { end: jest.fn() };
        }),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UploadsService,
        { provide: CLOUDINARY, useValue: cloudinary },
      ],
    }).compile();

    service = module.get(UploadsService);
  });

  it('throws when no file provided', async () => {
    await expect(
      service.uploadImage(undefined as unknown as Express.Multer.File),
    ).rejects.toThrow(BadRequestException);
  });

  it('throws when sharp processing fails', async () => {
    sharpToBuffer.mockRejectedValue(new Error('invalid image'));

    await expect(service.uploadImage(file)).rejects.toThrow(
      BadRequestException,
    );
  });

  it('returns image url on successful upload', async () => {
    sharpToBuffer.mockResolvedValue(Buffer.from('processed'));
    const uploadPromise = service.uploadImage(file);
    await Promise.resolve();

    uploadStreamCallback(undefined, {
      secure_url: 'https://res.cloudinary.com/demo/image.jpg',
    });

    await expect(uploadPromise).resolves.toEqual({
      message: 'Image uploaded successfully.',
      imageUrl: 'https://res.cloudinary.com/demo/image.jpg',
    });
    expect(sharp).toHaveBeenCalledWith(file.buffer);
  });

  it('throws internal error when cloudinary upload fails', async () => {
    sharpToBuffer.mockResolvedValue(Buffer.from('processed'));
    const uploadPromise = service.uploadImage(file);
    await Promise.resolve();

    uploadStreamCallback(new Error('network'), undefined);

    await expect(uploadPromise).rejects.toThrow(InternalServerErrorException);
  });
});
