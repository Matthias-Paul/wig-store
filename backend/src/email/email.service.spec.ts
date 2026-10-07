import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import brevoConfig from '../config/brevo.config';
import { Order } from '../orders/entities/order.entity';

const sendTransacEmail = jest.fn();

jest.mock('@getbrevo/brevo', () => ({
  BrevoClient: jest.fn().mockImplementation(() => ({
    transactionalEmails: { sendTransacEmail },
  })),
}));

function buildOrder(overrides: Partial<Order> = {}): Order {
  return {
    orderNumber: 'ORD-001',
    recipientName: 'Jane Doe',
    recipientEmail: 'jane@example.com',
    recipientPhone: '+2348000000000',
    shippingAddress: '12 Main St',
    shippingCity: 'Lagos',
    shippingState: 'LA',
    landmark: 'Near the park',
    totalAmount: 15000,
    deliveryFee: 2000,
    items: [
      {
        quantity: 2,
        priceAtPurchase: 6500,
        variant: {
          length: '14"',
          color: 'Black',
          closureSize: 'Medium',
          product: { name: 'Silk Wig' },
        },
      },
    ],
    ...overrides,
  } as Order;
}

describe('EmailService', () => {
  let service: EmailService;

  const brevoMock = {
    apiKey: 'test-api-key',
    senderEmail: 'noreply@test.com',
    senderName: 'Test Store',
    adminEmail: 'admin@test.com',
  };

  beforeEach(async () => {
    sendTransacEmail.mockReset();
    sendTransacEmail.mockResolvedValue(undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,
        { provide: brevoConfig.KEY, useValue: brevoMock },
      ],
    }).compile();

    service = module.get(EmailService);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('sendOrderConfirmation', () => {
    it('sends transactional email with order details', async () => {
      const order = buildOrder();

      await service.sendOrderConfirmation(order);

      expect(sendTransacEmail).toHaveBeenCalledTimes(1);
      expect(sendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: `Order Confirmed — ${order.orderNumber}`,
          sender: {
            email: brevoMock.senderEmail,
            name: brevoMock.senderName,
          },
          to: [{ email: order.recipientEmail, name: order.recipientName }],
          htmlContent: expect.stringContaining(order.orderNumber),
        }),
      );
    });

    it('retries once after the first send fails', async () => {
      jest.useFakeTimers();
      sendTransacEmail
        .mockRejectedValueOnce(new Error('network'))
        .mockResolvedValueOnce(undefined);

      const promise = service.sendOrderConfirmation(buildOrder());
      await jest.advanceTimersByTimeAsync(1500);
      await promise;

      expect(sendTransacEmail).toHaveBeenCalledTimes(2);
    });

    it('does not throw when both send attempts fail', async () => {
      jest.useFakeTimers();
      sendTransacEmail.mockRejectedValue(new Error('permanent failure'));

      const promise = service.sendOrderConfirmation(buildOrder());
      await jest.advanceTimersByTimeAsync(1500);
      await expect(promise).resolves.toBeUndefined();
      expect(sendTransacEmail).toHaveBeenCalledTimes(2);
    });
  });

  describe('sendPaymentFailedNotice', () => {
    it('sends payment failure email to the customer', async () => {
      const order = buildOrder();

      await service.sendPaymentFailedNotice(order);

      expect(sendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining(order.orderNumber),
          to: [{ email: order.recipientEmail, name: order.recipientName }],
        }),
      );
    });
  });

  describe('sendAdminNewOrderAlert', () => {
    it('sends alert to configured admin email', async () => {
      const order = buildOrder();

      await service.sendAdminNewOrderAlert(order);

      expect(sendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: [{ email: brevoMock.adminEmail }],
          subject: expect.stringContaining(order.orderNumber),
        }),
      );
    });

    it('skips send when admin email is not configured', async () => {
      const module: TestingModule = await Test.createTestingModule({
        providers: [
          EmailService,
          {
            provide: brevoConfig.KEY,
            useValue: { ...brevoMock, adminEmail: undefined },
          },
        ],
      }).compile();
      const svc = module.get(EmailService);

      await svc.sendAdminNewOrderAlert(buildOrder());

      expect(sendTransacEmail).not.toHaveBeenCalled();
    });
  });

  describe('sendOrderStatusUpdate', () => {
    it('uses known status copy for shipped', async () => {
      const order = buildOrder();

      await service.sendOrderStatusUpdate(order, 'shipped');

      expect(sendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: 'Order Update — Shipped',
          htmlContent: expect.stringContaining('on its way'),
        }),
      );
    });

    it('falls back to generic message for unknown status', async () => {
      const order = buildOrder();

      await service.sendOrderStatusUpdate(order, 'custom_status');

      expect(sendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          htmlContent: expect.stringContaining('custom_status'),
        }),
      );
    });
  });

  describe('sendWelcomeEmail', () => {
    it('sends welcome email to the new user', async () => {
      await service.sendWelcomeEmail('Alex', 'alex@example.com');

      expect(sendTransacEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          subject: expect.stringContaining('Alex'),
          to: [{ email: 'alex@example.com', name: 'Alex' }],
        }),
      );
    });
  });
});
