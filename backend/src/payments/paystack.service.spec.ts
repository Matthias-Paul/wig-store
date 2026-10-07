import { Test, TestingModule } from '@nestjs/testing';
import { BadGatewayException } from '@nestjs/common';
import axios from 'axios';
import * as crypto from 'crypto';
import paystackConfig from '../config/paystack.config';
import { PaystackService } from './paystack.service';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('PaystackService', () => {
  let service: PaystackService;
  const config = {
    secretKey: 'sk_test_secret',
    publicKey: 'pk_test',
    baseUrl: 'https://api.paystack.co',
  };

  beforeEach(async () => {
    mockedAxios.post.mockReset();
    mockedAxios.get.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PaystackService,
        { provide: paystackConfig.KEY, useValue: config },
      ],
    }).compile();

    service = module.get(PaystackService);
  });

  describe('initializeTransaction', () => {
    it('returns authorization data on success', async () => {
      const data = {
        authorization_url: 'https://paystack.com/pay',
        access_code: 'code',
        reference: 'ref-1',
      };
      mockedAxios.post.mockResolvedValue({ data: { data } });

      await expect(
        service.initializeTransaction({
          email: 'a@test.com',
          amountInKobo: 10000,
          reference: 'ref-1',
          callbackUrl: 'https://app/callback',
        }),
      ).resolves.toEqual(data);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        `${config.baseUrl}/transaction/initialize`,
        {
          email: 'a@test.com',
          amount: 10000,
          reference: 'ref-1',
          callback_url: 'https://app/callback',
        },
        { headers: { Authorization: `Bearer ${config.secretKey}` } },
      );
    });

    it('throws BadGatewayException when axios fails', async () => {
      mockedAxios.post.mockRejectedValue(new Error('network'));

      await expect(
        service.initializeTransaction({
          email: 'a@test.com',
          amountInKobo: 100,
          reference: 'r',
          callbackUrl: 'cb',
        }),
      ).rejects.toThrow(BadGatewayException);
    });
  });

  describe('verifyTransaction', () => {
    it('returns verification data on success', async () => {
      const data = { status: 'success', reference: 'ref-1', amount: 100, gateway_response: 'ok' };
      mockedAxios.get.mockResolvedValue({ data: { data } });

      await expect(service.verifyTransaction('ref-1')).resolves.toEqual(data);
      expect(mockedAxios.get).toHaveBeenCalledWith(
        `${config.baseUrl}/transaction/verify/ref-1`,
        { headers: { Authorization: `Bearer ${config.secretKey}` } },
      );
    });

    it('throws BadGatewayException when axios fails', async () => {
      mockedAxios.get.mockRejectedValue(new Error('timeout'));

      await expect(service.verifyTransaction('ref-1')).rejects.toThrow(
        BadGatewayException,
      );
    });
  });

  describe('verifyWebhookSignature', () => {
    it('returns true for matching HMAC signature', () => {
      const rawBody = Buffer.from('{"event":"charge.success"}');
      const signature = crypto
        .createHmac('sha512', config.secretKey)
        .update(rawBody)
        .digest('hex');

      expect(service.verifyWebhookSignature(rawBody, signature)).toBe(true);
    });

    it('returns false for invalid signature', () => {
      const rawBody = Buffer.from('payload');
      expect(service.verifyWebhookSignature(rawBody, 'invalid')).toBe(false);
    });
  });
});
