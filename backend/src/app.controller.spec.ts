import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let controller: AppController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    controller = module.get<AppController>(AppController);
  });

  describe('healthCheck', () => {
    it('returns ok status and ISO timestamp', () => {
      const before = Date.now();
      const result = controller.healthCheck();
      const after = Date.now();

      expect(result.status).toBe('ok');
      expect(result.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T/);
      const ts = new Date(result.timestamp).getTime();
      expect(ts).toBeGreaterThanOrEqual(before);
      expect(ts).toBeLessThanOrEqual(after);
    });
  });
});
