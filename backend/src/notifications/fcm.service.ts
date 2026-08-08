import { Injectable, Logger } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FcmService {
  private readonly logger = new Logger(FcmService.name);

  async sendToTokens(
    tokens: string[],
    title: string,
    body: string,
  ): Promise<void> {
    if (tokens.length === 0) return;

    try {
      const response = await admin.messaging().sendMulticast({
        tokens,
        notification: { title, body },
      });

      if (response.failureCount > 0) {
        this.logger.warn(
          `${response.failureCount} push notification(s) failed to deliver`,
        );
      }
    } catch (error) {
      this.logger.error('Failed to send push notification', error);
    }
  }  
}
