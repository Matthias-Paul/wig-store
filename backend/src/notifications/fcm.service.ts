import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

const MULTICAST_LIMIT = 500;

const STALE_TOKEN_CODES = new Set([
  'messaging/registration-token-not-registered',
  'messaging/invalid-registration-token',
]);

export type SendPushResult = {
  successCount: number;
  failureCount: number;
  staleTokens: string[];
};

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
    link?: string,
  ): Promise<SendPushResult> {
    const uniqueTokens = [...new Set(tokens.filter(Boolean))];

    if (uniqueTokens.length === 0) {
      return { successCount: 0, failureCount: 0, staleTokens: [] };
    }

    const staleTokens: string[] = [];
    let successCount = 0;
    let failureCount = 0;

    // sendEach uses FCM HTTP v1 per token. sendMulticast / sendEachForMulticast
    // in firebase-admin v10 still POST to https://fcm.googleapis.com/batch,
    // which Google removed (404 HTML page).
    for (let i = 0; i < uniqueTokens.length; i += MULTICAST_LIMIT) {
      const batch = uniqueTokens.slice(i, i + MULTICAST_LIMIT);
      const messages: admin.messaging.Message[] = batch.map((token) => ({
        token,
        notification: { title, body },
        data: link ? { link } : undefined,
        webpush: link
          ? {
              fcmOptions: { link },
            }
          : undefined,
      }));

      try {
        const response = await admin.messaging().sendEach(messages);

        response.responses.forEach((resp, index) => {
          if (resp.success) {
            successCount += 1;
            return;
          }

          failureCount += 1;
          const code = resp.error?.code ?? 'unknown';
          const message = resp.error?.message ?? 'no message';

          this.logger.warn(`FCM send failed code=${code} message=${message}`);

          if (STALE_TOKEN_CODES.has(code)) {
            staleTokens.push(batch[index]);
          }
        });
      } catch (error) {
        failureCount += batch.length;
        this.logger.error(
          'FCM sendEach request failed',
          error instanceof Error ? error.stack : String(error),
        );
      }
    }

    if (failureCount > 0) {
      this.logger.warn(
        `${failureCount} push notification(s) failed (${successCount} succeeded, ${staleTokens.length} stale tokens to drop)`,
      );
    }

    return { successCount, failureCount, staleTokens };
  }
}
