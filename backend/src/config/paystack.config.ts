import { registerAs } from '@nestjs/config';

export default registerAs('paystack', () => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  const publicKey = process.env.PAYSTACK_PUBLIC_KEY;

  if (!secretKey || !publicKey) {
    throw new Error(
      'Paystack API keys are not defined in environment variables',
    );
  }

  return { secretKey, publicKey, baseUrl: 'https://api.paystack.co' };
});
