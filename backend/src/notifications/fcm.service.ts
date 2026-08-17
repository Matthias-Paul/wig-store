import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
    link?: string,
  ): Promise<void> {
    const uniqueTokens = [...new Set(tokens.filter(Boolean))];

    if (uniqueTokens.length === 0) return;

    const results = await Promise.allSettled(
      uniqueTokens.map((token) =>
        admin.messaging().send({
          token,
          notification: {
            title,
            body,
          },
          data: link ? { link } : {},
          webpush: link
            ? {
                fcmOptions: {
                  link,
                },
              }
            : undefined,
        }),
      ),
    );

    const failures = results.filter((result) => result.status === 'rejected');

    if (failures.length > 0) {
      this.logger.warn(
        `${failures.length} push notification(s) failed to deliver`,
      );
    }
  }
}
