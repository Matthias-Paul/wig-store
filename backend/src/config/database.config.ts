import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  url: process.env.DATABASE_URL,
  autoLoadEntities:
    process.env.DB_AUTO_LOAD === 'true' ||
    process.env.DB_AUTO_LOAD === undefined,
  synchronize: process.env.NODE_ENV !== 'production',
  logging: process.env.NODE_ENV === 'development',
}));
