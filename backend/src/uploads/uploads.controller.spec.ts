import { Test, TestingModule } from '@nestjs/testing';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';

describe('UploadsController', () => {
  let controller: UploadsController;
  let uploadsService: jest.Mocked<UploadsService>;

  beforeEach(async () => {
    const mockUploadsService = {
      uploadImage: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UploadsController],
      providers: [{ provide: UploadsService, useValue: mockUploadsService }],
    }).compile();

    controller = module.get(UploadsController);
    uploadsService = module.get(UploadsService);
  });

  it('uploadImage passes file to service and returns result', async () => {
    const file = {
      buffer: Buffer.from('img'),
      originalname: 'test.jpg',
    } as Express.Multer.File;
    const result = {
      message: 'Image uploaded successfully.',
      imageUrl: 'https://cdn.example/img.jpg',
    };
    uploadsService.uploadImage.mockResolvedValue(result);

    await expect(controller.uploadImage(file)).resolves.toBe(result);
    expect(uploadsService.uploadImage).toHaveBeenCalledWith(file);
  });
});
