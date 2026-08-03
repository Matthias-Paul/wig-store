import { Injectable, Inject, Logger } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { BrevoClient } from '@getbrevo/brevo';
import brevoConfig from '../config/brevo.config';
import { Order } from '../orders/entities/order.entity';

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

  async sendOrderConfirmation(order: Order): Promise<void> {
    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td>${item.variant.product.name} (${item.variant.length}-inch ${item.variant.pattern})</td>
          <td>${item.quantity}</td>
          <td>₦${Number(item.priceAtPurchase).toLocaleString()}</td>
        </tr>`,
      )
      .join('');

    const html = `
      <h2>Order Confirmed 🎉</h2>
      <p>Hi ${order.recipientName}, your order has been confirmed and is being processed.</p>
      <table border="1" cellpadding="8" cellspacing="0">
        <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <p><strong>Total: ₦${Number(order.totalAmount).toLocaleString()}</strong></p>
      <p>Shipping to: ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState}</p>
    `;

    try {
      await this.client.transactionalEmails.sendTransacEmail({
        subject: `Order Confirmed — #${order.id.slice(0, 8)}`,
        htmlContent: html,
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email: order.recipientEmail, name: order.recipientName }],
      });
    } catch (error) {
      this.logger.error(
        `Failed to send order confirmation for order ${order.id}`,
        error,
      );
    }
  }

  async sendPaymentFailedNotice(order: Order): Promise<void> {
    try {
      await this.client.transactionalEmails.sendTransacEmail({
        subject: `Payment issue with your order — #${order.id.slice(0, 8)}`,
        htmlContent: `
          <h2>We couldn't process your payment</h2>
          <p>Hi ${order.recipientName}, your payment for order #${order.id.slice(0, 8)} was not successful.</p>
          <p>You can retry payment from your order history — your items are still reserved for a short while.</p>
        `,
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email: order.recipientEmail, name: order.recipientName }],
      });
    } catch (error) {
      this.logger.error(
        `Failed to send payment-failed notice for order ${order.id}`,
        error,
      );
    }
  }

  async sendAdminNewOrderAlert(order: Order): Promise<void> {
    const adminEmail = this.config.adminEmail;

    if (!adminEmail) {
      this.logger.error('Admin notification email is not configured');
      return;
    }

    const itemsHtml = order.items
      .map(
        (item) => `
      <tr>
        <td>${item.variant.product.name} (${item.variant.length}-inch ${item.variant.pattern})</td>
        <td>${item.quantity}</td>
        <td>₦${Number(item.priceAtPurchase).toLocaleString()}</td>
      </tr>`,
      )
      .join('');

    const html = `
    <h2>🎉 New Paid Order</h2>
    <p><strong>Customer:</strong> ${order.recipientName} (${order.recipientPhone})</p>
    <p><strong>Email:</strong> ${order.recipientEmail}</p>
    <table border="1" cellpadding="8" cellspacing="0">
      <thead><tr><th>Item</th><th>Qty</th><th>Price</th></tr></thead>
      <tbody>${itemsHtml}</tbody>
    </table>
    <p><strong>Total: ₦${Number(order.totalAmount).toLocaleString()}</strong></p>
    <p><strong>Ship to:</strong> ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState}
    ${order.landmark ? ` (Landmark: ${order.landmark})` : ''}</p>
    <p>Order ID: ${order.id}</p>
  `;

    try {
      await this.client.transactionalEmails.sendTransacEmail({
        subject: `New Order Received — ₦${Number(order.totalAmount).toLocaleString()}`,
        htmlContent: html,
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email: adminEmail }], // now guaranteed string
      });
    } catch (error) {
      this.logger.error(
        `Failed to send admin order alert for order ${order.id}`,
        error,
      );
    }
  }

  async sendOrderStatusUpdate(order: Order, status: string): Promise<void> {
    const statusMessages: Record<string, string> = {
      processing: 'Your order is now being prepared for shipment.',
      shipped: 'Your order is on its way!',
      delivered: 'Your order has been delivered. We hope you love it!',
    };

    const message =
      statusMessages[status] ??
      `Your order status has been updated to ${status}.`;

    try {
      await this.client.transactionalEmails.sendTransacEmail({
        subject: `Order Update — ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        htmlContent: `
          <h2>Order Update</h2>
          <p>Hi ${order.recipientName}, ${message}</p>
          <p>Order ID: ${order.id.slice(0, 8)}</p>
          <p>Shipping to: ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingState}</p>
        `,
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email: order.recipientEmail, name: order.recipientName }],
      });
    } catch (error) {
      this.logger.error(
        `Failed to send status update email for order ${order.id}`,
        error,
      );
    }
  }

  async sendWelcomeEmail(name: string, email: string): Promise<void> {
    try {
      await this.client.transactionalEmails.sendTransacEmail({
        subject: `Welcome to Wig Store, ${name}! 🎉`,
        htmlContent: `
        <h2>Welcome, ${name}!</h2>
        <p>Thanks for signing up. We're so glad to have you.</p>
        <p>Browse our latest wigs and bundles, and enjoy your shopping experience with us.</p>
      `,
        sender: {
          email: this.config.senderEmail,
          name: this.config.senderName,
        },
        to: [{ email, name }],
      });
    } catch (error) {
      this.logger.error(`Failed to send welcome email to ${email}`, error);
    }
  }
}
