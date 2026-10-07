import { Test, TestingModule } from '@nestjs/testing';
import type { Request } from 'express';
import { PaymentsController } from './payments.controller';
import { PaymentsService } from './payments.service';

describe('PaymentsController', () => {
  let controller: PaymentsController;
  let service: jest.Mocked<
    Pick<PaymentsService, 'initialize' | 'handleWebhook' | 'checkStatus'>
  >;

  beforeEach(async () => {
    service = {
      initialize: jest.fn(),
      handleWebhook: jest.fn(),
      checkStatus: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentsController],
      providers: [{ provide: PaymentsService, useValue: service }],
    }).compile();

    controller = module.get(PaymentsController);
  });

  it('initialize passes userId and orderId from dto', async () => {
    const result = { message: 'Payment initialized', authorizationUrl: 'url' };
    service.initialize.mockResolvedValue(result as never);

    await expect(
      controller.initialize('user-1', { orderId: 'ord-1' }),
    ).resolves.toBe(result);
    expect(service.initialize).toHaveBeenCalledWith('user-1', 'ord-1');
  });

  it('handleWebhook passes raw body and signature', async () => {
    const body = Buffer.from('{}');
    const req = { body } as Request;
    const response = { message: 'Webhook processed successfully' };
    service.handleWebhook.mockResolvedValue(response);

    await expect(controller.handleWebhook(req, 'sig')).resolves.toBe(response);
    expect(service.handleWebhook).toHaveBeenCalledWith(body, 'sig');
  });

  it('checkStatus passes userId and orderId', async () => {
    const status = { orderId: 'ord-1', status: 'paid', paystackReference: 'ref' };
    service.checkStatus.mockResolvedValue(status as never);

    await expect(
      controller.checkStatus('user-1', { orderId: 'ord-1' }),
    ).resolves.toBe(status);
    expect(service.checkStatus).toHaveBeenCalledWith('user-1', 'ord-1');
  });
});
