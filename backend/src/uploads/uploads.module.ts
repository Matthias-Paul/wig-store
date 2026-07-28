import { Module } from '@nestjs/common';
import { UploadsService } from './uploads.service';
import { UploadsController } from './uploads.controller';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  providers: [UploadsService, CloudinaryProvider],
  controllers: [UploadsController],
  exports: [UploadsService],
})
export class UploadsModule {}
