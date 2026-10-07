import { Test, TestingModule } from '@nestjs/testing';
import { FcmService } from './fcm.service';

const sendEach = jest.fn();

jest.mock('firebase-admin', () => ({
  messaging: jest.fn(() => ({ sendEach })),
}));

describe('FcmService', () => {
  let service: FcmService;

  beforeEach(async () => {
    sendEach.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      providers: [FcmService],
    }).compile();

    service = module.get(FcmService);
  });

  it('returns empty result when no tokens are provided', async () => {
    await expect(service.sendToTokens([], 'Hi', 'Body')).resolves.toEqual({
      successCount: 0,
      failureCount: 0,
      staleTokens: [],
    });
    expect(sendEach).not.toHaveBeenCalled();
  });

  it('deduplicates tokens and ignores empty values', async () => {
    sendEach.mockResolvedValue({
      responses: [{ success: true }, { success: true }],
    });

    await service.sendToTokens(
      ['token-a', 'token-a', '', 'token-b'],
      'Title',
      'Body',
    );

    expect(sendEach).toHaveBeenCalledTimes(1);
    const messages = sendEach.mock.calls[0][0];
    expect(messages).toHaveLength(2);
    expect(messages.map((m: { token: string }) => m.token)).toEqual([
      'token-a',
      'token-b',
    ]);
  });

  it('includes link in data and webpush when provided', async () => {
    sendEach.mockResolvedValue({ responses: [{ success: true }] });
    const link = 'https://app.example/orders/1';

    await service.sendToTokens(['token-a'], 'Title', 'Body', link);

    expect(sendEach).toHaveBeenCalledWith([
      expect.objectContaining({
        token: 'token-a',
        notification: { title: 'Title', body: 'Body' },
        data: { link },
        webpush: { fcmOptions: { link } },
      }),
    ]);
  });

  it('counts successes and collects stale token codes', async () => {
    sendEach.mockResolvedValue({
      responses: [
        { success: true },
        {
          success: false,
          error: {
            code: 'messaging/registration-token-not-registered',
            message: 'gone',
          },
        },
        {
          success: false,
          error: {
            code: 'messaging/invalid-registration-token',
            message: 'bad',
          },
        },
        {
          success: false,
          error: { code: 'messaging/internal-error', message: 'retry' },
        },
      ],
    });

    const result = await service.sendToTokens(
      ['ok', 'stale-1', 'stale-2', 'other-fail'],
      'T',
      'B',
    );

    expect(result).toEqual({
      successCount: 1,
      failureCount: 3,
      staleTokens: ['stale-1', 'stale-2'],
    });
  });

  it('treats sendEach rejection as full batch failure', async () => {
    sendEach.mockRejectedValue(new Error('FCM down'));

    const result = await service.sendToTokens(['a', 'b'], 'T', 'B');

    expect(result).toEqual({
      successCount: 0,
      failureCount: 2,
      staleTokens: [],
    });
  });
});
