import { registerAs } from '@nestjs/config';

export default registerAs('brevo', () => {
  const apiKey = process.env.BREVO_API_KEY;
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const senderName = process.env.BREVO_SENDER_NAME ?? 'Wig Store';
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL;
  const supportEmail =
    process.env.SUPPORT_EMAIL?.trim() || 'janetdesina@gmail.com';

  if (!apiKey || !senderEmail) {
    throw new Error('Brevo environment variables are not fully defined');
  }

  return { apiKey, senderEmail, senderName, adminEmail, supportEmail };
});
 