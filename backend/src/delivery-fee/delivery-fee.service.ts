// backend/src/delivery-fees/delivery-fees.service.ts
import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';
import { DeliveryFee } from './entities/delivery-fee.entity';
import { UpdateDeliveryFeeDto } from './dtos/update-delivery-fee.dto';

@Injectable()
export class DeliveryFeesService {
  constructor(
    @InjectRepository(DeliveryFee)
    private deliveryFeeRepo: Repository<DeliveryFee>,
  ) {}

  findAll() {
    return this.deliveryFeeRepo.find({ order: { state: 'ASC' } });
  }

  async getFeeForState(state: string): Promise<DeliveryFee> {
    const record = await this.deliveryFeeRepo.findOne({
      where: { state: ILike(state), isActive: true },
    });

    if (!record) {
      throw new BadRequestException(
        `Delivery is not currently available for "${state}". Please contact support.`,
      );
    }

    return record;
  }

  async findByState(state: string) {
    const record = await this.deliveryFeeRepo.findOne({
      where: { state: ILike(state) },
    });
    if (!record) {
      throw new NotFoundException('No delivery fee found for this state');
    }
    return record;
  }

  async update(id: string, dto: UpdateDeliveryFeeDto) {
    const record = await this.deliveryFeeRepo.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException('Delivery fee entry not found');
    }

    record.fee = dto.fee;
    if (dto.isActive !== undefined) {
      record.isActive = dto.isActive;
    }

    const updated = await this.deliveryFeeRepo.save(record);
    return {
      message: 'Delivery fee updated successfully',
      deliveryFee: updated,
    };
  }
}
