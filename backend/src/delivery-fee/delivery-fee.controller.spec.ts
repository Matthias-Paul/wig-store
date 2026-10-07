import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { DeliveryFeesController } from './delivery-fee.controller';
import { DeliveryFeesService } from './delivery-fee.service';

describe('DeliveryFeesController', () => {
  let controller: DeliveryFeesController;
  let service: jest.Mocked<
    Pick<DeliveryFeesService, 'getFeeForState' | 'findAll' | 'update'>
  >;

  beforeEach(async () => {
    service = {
      getFeeForState: jest.fn(),
      findAll: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [DeliveryFeesController],
      providers: [{ provide: DeliveryFeesService, useValue: service }],
    }).compile();

    controller = module.get(DeliveryFeesController);
  });

  describe('getFee', () => {
    it('requires state query parameter', async () => {
      await expect(controller.getFee(undefined)).rejects.toThrow(
        BadRequestException,
      );
      expect(service.getFeeForState).not.toHaveBeenCalled();
    });

    it('delegates to getFeeForState', async () => {
      const fee = { state: 'Lagos', fee: 1500 };
      service.getFeeForState.mockResolvedValue(fee as never);

      await expect(controller.getFee('Lagos')).resolves.toBe(fee);
      expect(service.getFeeForState).toHaveBeenCalledWith('Lagos');
    });
  });

  describe('findAll', () => {
    it('returns all fees from service', async () => {
      const fees = [{ id: '1' }];
      service.findAll.mockResolvedValue(fees as never);

      await expect(controller.findAll()).resolves.toBe(fees);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('passes id and dto to service', async () => {
      const dto = { fee: 2000 };
      const response = { message: 'ok', deliveryFee: { id: '1' } };
      service.update.mockResolvedValue(response as never);

      await expect(controller.update('1', dto)).resolves.toBe(response);
      expect(service.update).toHaveBeenCalledWith('1', dto);
    });
  });
});
