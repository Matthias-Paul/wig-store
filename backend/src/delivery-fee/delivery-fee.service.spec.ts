import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { ILike, Repository } from 'typeorm';
import { DeliveryFeesService } from './delivery-fee.service';
import { DeliveryFee } from './entities/delivery-fee.entity';

describe('DeliveryFeesService', () => {
  let service: DeliveryFeesService;
  let repo: jest.Mocked<Pick<Repository<DeliveryFee>, 'find' | 'findOne' | 'save'>>;

  beforeEach(async () => {
    repo = {
      find: jest.fn(),
      findOne: jest.fn(),
      save: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeliveryFeesService,
        { provide: getRepositoryToken(DeliveryFee), useValue: repo },
      ],
    }).compile();

    service = module.get(DeliveryFeesService);
  });

  describe('findAll', () => {
    it('returns all delivery fees ordered by state', async () => {
      const fees = [{ id: '1', state: 'Lagos' }] as DeliveryFee[];
      repo.find.mockResolvedValue(fees);

      await expect(service.findAll()).resolves.toBe(fees);
      expect(repo.find).toHaveBeenCalledWith({ order: { state: 'ASC' } });
    });
  });

  describe('getFeeForState', () => {
    it('returns active fee for state (case-insensitive)', async () => {
      const fee = { id: '1', state: 'Lagos', fee: 1500, isActive: true } as DeliveryFee;
      repo.findOne.mockResolvedValue(fee);

      await expect(service.getFeeForState('lagos')).resolves.toBe(fee);
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { state: ILike('lagos'), isActive: true },
      });
    });

    it('throws when no active fee exists', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.getFeeForState('Unknown')).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('findByState', () => {
    it('returns fee record for state', async () => {
      const fee = { id: '1', state: 'Abuja' } as DeliveryFee;
      repo.findOne.mockResolvedValue(fee);

      await expect(service.findByState('Abuja')).resolves.toBe(fee);
    });

    it('throws NotFoundException when missing', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.findByState('None')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('updates fee and isActive when provided', async () => {
      const record = {
        id: 'fee-1',
        fee: 1000,
        isActive: true,
      } as DeliveryFee;
      const saved = { ...record, fee: 2000, isActive: false } as DeliveryFee;
      repo.findOne.mockResolvedValue(record);
      repo.save.mockResolvedValue(saved);

      const result = await service.update('fee-1', { fee: 2000, isActive: false });

      expect(record.fee).toBe(2000);
      expect(record.isActive).toBe(false);
      expect(repo.save).toHaveBeenCalledWith(record);
      expect(result).toEqual({
        message: 'Delivery fee updated successfully',
        deliveryFee: saved,
      });
    });

    it('updates fee only when isActive omitted', async () => {
      const record = { id: 'fee-1', fee: 1000, isActive: true } as DeliveryFee;
      repo.findOne.mockResolvedValue(record);
      repo.save.mockResolvedValue({ ...record, fee: 1500 } as DeliveryFee);

      await service.update('fee-1', { fee: 1500 });

      expect(record.isActive).toBe(true);
    });

    it('throws when entry not found', async () => {
      repo.findOne.mockResolvedValue(null);

      await expect(service.update('missing', { fee: 1 })).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
