import { registerAs } from '@nestjs/config';

export default registerAs('auth', () => {
  const accessSecret = process.env.JWT_ACCESS_SECRET;
  const refreshSecret = process.env.JWT_REFRESH_SECRET;

  if (!accessSecret || !refreshSecret) {
    throw new Error('JWT secrets are not defined in environment variables');
  }

  return {
    secret: accessSecret,
    refreshSecret,
    accessExpiresIn: 15 * 60, 
    refreshExpiresIn: 7 * 24 * 60 * 60,
  };
});
