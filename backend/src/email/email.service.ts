import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';
import brevoConfig from '../config/brevo.config';
import { Order } from '../orders/entities/order.entity';

const BRAND_COLOR = '#7E297E';
const LOGO_URL =
  'https://res.cloudinary.com/drkxtuaeg/image/upload/v1785842112/lxvaiiwhocdppargd5bc.jpg';
const BRAND_NAME = 'Rockshairmpire';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly client: BrevoClient;

  constructor(
    @Inject(brevoConfig.KEY)
    private readonly config: ConfigType<typeof brevoConfig>,
  ) {
    this.client = new BrevoClient({ apiKey: this.config.apiKey });
  }

  /**
   * Sends an email with one automatic retry on failure — protects against
   * transient network blips without adding a full queue/durability layer.
   */
  private async sendWithRetry(
    params: Parameters<
      BrevoClient['transactionalEmails']['sendTransacEmail']
    >[0],
    context: string,
  ): Promise<void> {
    try {
      await this.client.transactionalEmails.sendTransacEmail(params);
      return;
    } catch (firstError) {
      this.logger.warn(`First attempt failed for ${context}, retrying once...`);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      console.log(firstError);
      try {
        await this.client.transactionalEmails.sendTransacEmail(params);
      } catch (secondError) {
        this.logger.error(
          `Failed to send email after retry — ${context}`,
          secondError,
        );
      }
    }
  }

  private wrapTemplate(innerHtml: string): string {
    return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0; padding:0; background-color:#f4f4f7; font-family:Arial, Helvetica, sans-serif;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f7; padding:30px 0;">
        <tr>
          <td align="center">
            <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border:1px solid #e5e5e5; border-radius:8px; overflow:hidden;">
              <tr>
                <td style="background-color:${BRAND_COLOR}; padding:24px 32px; text-align:center;">
                  <img src="${LOGO_URL}" alt="${BRAND_NAME}" width="60" height="60" style="border-radius:50%; display:block; margin:0 auto 8px auto;" />
                  <span style="color:#ffffff; font-size:20px; font-weight:bold; letter-spacing:0.5px;">${BRAND_NAME}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:32px;">
                  ${innerHtml}
                </td>
              </tr>
              <tr>
                <td style="background-color:#faf5fa; padding:20px 32px; text-align:center; border-top:1px solid #e5e5e5;">
                  <p style="margin:0; font-size:12px; color:#888888;">
                    ${BRAND_NAME} &mdash; rock every hair with confidence.
                  </p>
                  <p style="margin:6px 0 0 0; font-size:12px; color:#aaaaaa;">
                    If you have any questions about your order, simply reply to this email or contact our support team.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;
  }

  private buildItemsTable(order: Order): string {
    const rows = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding:10px 8px; border-bottom:1px solid #eeeeee; font-size:14px; color:#333333;">
            ${item.variant.product.name}<br/>
            <span style="font-size:12px; color:#888888;">${item.variant.length}-inch, ${item.variant.pattern}</span>
          </td>
          <td style="padding:10px 8px; border-bottom:1px solid #eeeeee; font-size:14px; color:#333333; text-align:center;">
            ${item.quantity}
          </td>
          <td style="padding:10px 8px; border-bottom:1px solid #eeeeee; font-size:14px; color:#333333; text-align:right;">
            ₦${Number(item.priceAtPurchase).toLocaleString()}
          </td>
        </tr>`,
      )
      .join('');

    return `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0; border:1px solid #eeeeee; border-radius:6px; overflow:hidden;">
        <tr style="background-color:#faf5fa;">
          <th style="padding:10px 8px; text-align:left; font-size:12px; color:${BRAND_COLOR}; text-transform:uppercase;">Item</th>
          <th style="padding:10px 8px; text-align:center; font-size:12px; color:${BRAND_COLOR}; text-transform:uppercase;">Qty</th>
          <th style="padding:10px 8px; text-align:right; font-size:12px; color:${BRAND_COLOR}; text-transform:uppercase;">Price</th>
        </tr>
        ${rows}
      </table>
    `;
  }

  async sendOrderConfirmation(order: Order): Promise<void> {
    const content = `
      <h2 style="color:#222222; font-size:20px; margin:0 0 6px 0;">Thanks for your order, ${order.recipientName}</h2>
      <p style="color:#555555; font-size:14px; line-height:1.6; margin:0 0 16px 0;">
        We've received your order and it's being processed. Here's a summary:
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr>
          <td style="font-size:13px; color:#888888;">Order Number </td>
          <td style="font-size:13px; color:#222222; text-align:right; font-weight:bold;"> ${order.orderNumber}</td>
        </tr>
      </table>
      ${this.buildItemsTable(order)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
        <tr>
          <td style="font-size:15px; color:#222222; font-weight:bold; text-align:right;">
            Total: ₦${Number(order.totalAmount).toLocaleString()}
          </td>
        </tr>
      </table>
      <div style="margin-top:24px; padding:16px; background-color:#faf5fa; border-radius:6px;">
        <p style="margin:0 0 4px 0; font-size:13px; color:${BRAND_COLOR}; font-weight:bold;">Delivery Address</p>
        <p style="margin:0; font-size:14px; color:#333333; line-height:1.5;">
          ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState}
          ${order.landmark ? `<br/>Landmark: ${order.landmark}` : ''}
        </p>
      </div>
      <p style="color:#555555; font-size:14px; line-height:1.6; margin-top:24px;">
        You can track this order anytime using your order number above. We'll send you an update as soon as it ships.
      </p>
    `;

    await this.sendWithRetry(
      {
        subject: `Order Confirmed — ${order.orderNumber}`,
        htmlContent: this.wrapTemplate(content),
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email: order.recipientEmail, name: order.recipientName }],
      },
      `order confirmation for ${order.orderNumber}`,
    );
  }

  async sendPaymentFailedNotice(order: Order): Promise<void> {
    const content = `
      <h2 style="color:#222222; font-size:20px; margin:0 0 6px 0;">We couldn't process your payment</h2>
      <p style="color:#555555; font-size:14px; line-height:1.6; margin:0 0 16px 0;">
        Hi ${order.recipientName}, your payment for order <strong>${order.orderNumber}</strong> didn't go through.
        Your items are still reserved for a short while, so you can retry from your order history whenever you're ready.
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;">
        <tr>
          <td style="background-color:${BRAND_COLOR}; border-radius:6px;">
            <a href="${process.env.FRONTEND_URL}/orders" style="display:inline-block; padding:12px 24px; color:#ffffff; text-decoration:none; font-size:14px; font-weight:bold;">
              Retry Payment
            </a>
          </td>
        </tr>
      </table>
    `;

    await this.sendWithRetry(
      {
        subject: `Payment issue with your order — ${order.orderNumber}`,
        htmlContent: this.wrapTemplate(content),
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email: order.recipientEmail, name: order.recipientName }],
      },
      `payment-failed notice for ${order.orderNumber}`,
    );
  }

  async sendAdminNewOrderAlert(order: Order): Promise<void> {
    const adminEmail = this.config.adminEmail;

    if (!adminEmail) {
      this.logger.error('Admin notification email is not configured');
      return;
    }

    const content = `
      <h2 style="color:#222222; font-size:20px; margin:0 0 6px 0;">New order received 🎉</h2>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
        <tr><td style="font-size:13px; color:#888888; padding:2px 0;">Order Number</td><td style="font-size:13px; color:#222222; text-align:right; font-weight:bold;">${order.orderNumber}</td></tr>
        <tr><td style="font-size:13px; color:#888888; padding:2px 0;">Customer</td><td style="font-size:13px; color:#222222; text-align:right;">${order.recipientName}</td></tr>
        <tr><td style="font-size:13px; color:#888888; padding:2px 0;">Phone</td><td style="font-size:13px; color:#222222; text-align:right;">${order.recipientPhone}</td></tr>
        <tr><td style="font-size:13px; color:#888888; padding:2px 0;">Email</td><td style="font-size:13px; color:#222222; text-align:right;">${order.recipientEmail}</td></tr>
      </table>
      ${this.buildItemsTable(order)}
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
        <tr>
          <td style="font-size:15px; color:#222222; font-weight:bold; text-align:right;">
            Total: ₦${Number(order.totalAmount).toLocaleString()}
          </td>
        </tr>
      </table>
      <div style="margin-top:24px; padding:16px; background-color:#faf5fa; border-radius:6px;">
        <p style="margin:0 0 4px 0; font-size:13px; color:${BRAND_COLOR}; font-weight:bold;">Ship To</p>
        <p style="margin:0; font-size:14px; color:#333333; line-height:1.5;">
          ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState}
          ${order.landmark ? `<br/>Landmark: ${order.landmark}` : ''}
        </p>
      </div>
    `;

    await this.sendWithRetry(
      {
        subject: `New Order Received — ${order.orderNumber}`,
        htmlContent: this.wrapTemplate(content),
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email: adminEmail }],
      },
      `admin order alert for ${order.orderNumber}`,
    );
  }

  async sendOrderStatusUpdate(order: Order, status: string): Promise<void> {
    const statusMessages: Record<string, string> = {
      processing: "Good news — we're getting your order ready to ship.",
      shipped: 'Your order is on its way to you!',
      delivered:
        'Your order has arrived. We hope you enjoy it — thank you for shopping with us.',
    };

    const message =
      statusMessages[status] ??
      `Your order status has been updated to ${status}.`;

    const content = `
      <h2 style="color:#222222; font-size:20px; margin:0 0 6px 0;">Order Update</h2>
      <p style="color:#555555; font-size:14px; line-height:1.6; margin:0 0 16px 0;">
        Hi ${order.recipientName}, ${message}
      </p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0;">
        <tr>
          <td style="font-size:13px; color:#888888;">Order Number </td>
          <td style="font-size:13px; color:#222222; text-align:right; font-weight:bold;"> ${order.orderNumber}</td>
        </tr>
        <tr>
          <td style="font-size:13px; color:#888888;">Status</td>
          <td style="font-size:13px; color:${BRAND_COLOR}; text-align:right; font-weight:bold; text-transform:capitalize;">${status}</td>
        </tr>
      </table>
      <div style="margin-top:16px; padding:16px; background-color:#faf5fa; border-radius:6px;">
        <p style="margin:0 0 4px 0; font-size:13px; color:${BRAND_COLOR}; font-weight:bold;">Delivery Address</p>
        <p style="margin:0; font-size:14px; color:#333333; line-height:1.5;">
          ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState}
        </p>
      </div>
    `;

    await this.sendWithRetry(
      {
        subject: `Order Update — ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        htmlContent: this.wrapTemplate(content),
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email: order.recipientEmail, name: order.recipientName }],
      },
      `status update (${status}) for ${order.orderNumber}`,
    );
  }

  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    const content = `
      <h2 style="color:#222222; font-size:20px; margin:0 0 6px 0;">Welcome, ${name} </h2>
      <p style="color:#555555; font-size:14px; line-height:1.6; margin:0 0 16px 0;">
        Thanks for creating an account with ${BRAND_NAME}. You're all set to start browsing
        our collection — From bundles to wigs, we’ve got something for every style. From kits to accessories, we’ve got something for every need..
      </p>
      <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:12px;">
        <tr>
          <td style="background-color:${BRAND_COLOR}; border-radius:6px;">
            <a href="${process.env.FRONTEND_URL}" style="display:inline-block; padding:12px 24px; color:#ffffff; text-decoration:none; font-size:14px; font-weight:bold;">
              Start Shopping
            </a>
          </td>
        </tr>
      </table>
    `;

    await this.sendWithRetry(
      {
        subject: `Welcome to ${BRAND_NAME}, ${name}`,
        htmlContent: this.wrapTemplate(content),
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email, name }],
      },
      `welcome email to ${email}`,
    );
  }
}
