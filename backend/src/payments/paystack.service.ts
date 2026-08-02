import { Injectable, Inject, BadGatewayException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import axios from 'axios';
import * as crypto from 'crypto';
import paystackConfig from '../config/paystack.config';

interface PaystackInitializeResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

interface PaystackVerifyResponse {
  status: boolean;
  message: string;
  data: {
    status: string;
    reference: string;
    amount: number;
    gateway_response: string;
  };
}

@Injectable()
export class PaystackService {
  constructor(
    @Inject(paystackConfig.KEY)
    private readonly config: ConfigType<typeof paystackConfig>,
  ) {}

  async initializeTransaction(params: {
    email: string;
    amountInKobo: number;
    reference: string;
    callbackUrl: string;
  }): Promise<PaystackInitializeResponse['data']> {
    try {
      const response = await axios.post<PaystackInitializeResponse>(
        `${this.config.baseUrl}/transaction/initialize`,
        {
          email: params.email,
          amount: params.amountInKobo,
          reference: params.reference,
          callback_url: params.callbackUrl,
        },
        {
          headers: { Authorization: `Bearer ${this.config.secretKey}` },
        },
      );

      return response.data.data;
    } catch (error) {
      throw new BadGatewayException(
        'Could not initialize payment. Please try again.',
      );
    }
  }

  async verifyTransaction(
    reference: string,
  ): Promise<PaystackVerifyResponse['data']> {
    try {
      const response = await axios.get<PaystackVerifyResponse>(
        `${this.config.baseUrl}/transaction/verify/${reference}`,
        {
          headers: { Authorization: `Bearer ${this.config.secretKey}` },
        },
      );

      return response.data.data;
    } catch (error) {
      throw new BadGatewayException(
        'Could not verify payment status. Please try again.',
      );
    }
  }

  verifyWebhookSignature(rawBody: Buffer, signature: string): boolean {
    const hash = crypto
      .createHmac('sha512', this.config.secretKey)
      .update(rawBody)
      .digest('hex');

    return hash === signature;
  }
}
