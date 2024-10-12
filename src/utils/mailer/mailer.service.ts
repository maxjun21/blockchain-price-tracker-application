import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import Templates from '../../html/emailTemplates';
import config from '../../config/configuration';

@Injectable()
export class MailerService {
  private transporter;
  private readonly logger = new Logger(MailerService.name);

  constructor() {
    const emailConfig = config().email;

    if (!emailConfig || !emailConfig.user || !emailConfig.password) {
      this.logger.error('Email configuration is not properly defined');
      throw new Error('Email configuration is not properly defined');
    }

    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: emailConfig.user,
        pass: emailConfig.password,
      },
    });

    this.logger.log('Email service initialized successfully');
  }

  async sendEmail(
    to: string,
    subject: string,
    htmlContent: string,
  ): Promise<void> {
    try {
      const emailConfig = config().email;

      const info = await this.transporter.sendMail({
        from: emailConfig.user,
        to: to,
        subject: subject,
        html: htmlContent,
      });

      this.logger.log(`Email sent successfully: ${info.response}`);
    } catch (error) {
      this.logger.error(`Error sending email: ${error.message}`, error.stack);
      throw new Error(`Failed to send email: ${error.message}`);
    }
  }

  /**
   * Sends a price increase alert email.
   * @param email - Recipient email address
   * @param chain - The chain (e.g., cryptocurrency) name
   * @param oldPrice - Previous price before the increase
   * @param newPrice - New price after the increase
   * @param percentage - Percentage increase
   */
  async sendPriceIncreaseEmail(
    email: string,
    chain: string,
    oldPrice: number,
    newPrice: number,
    percentage: string,
  ): Promise<void> {
    const subject = `Price Alert: ${chain.toUpperCase()} Increased by ${percentage}%`;
    const content = Templates.priceAlertEmailTemplate(
      chain,
      'Price Increase Alert',
      Templates.priceIncreaseContent(oldPrice, newPrice, percentage),
    );

    await this.sendEmail(email, subject, content);
  }

  /**
   * Sends a target price alert email.
   * @param email - Recipient email address
   * @param chain - The chain (e.g., cryptocurrency) name
   * @param targetPrice - Target price to be achieved
   * @param currentPrice - Current price
  //  */
  async sendTargetPriceEmail(
    email: string,
    chain: string,
    targetPrice: number,
    currentPrice: number,
  ): Promise<void> {
    const subject = `Price Alert: ${chain.toUpperCase()} Reached $${targetPrice}`;
    const content = Templates.priceAlertEmailTemplate(
      chain,
      'Target Price Alert',
      Templates.targetPriceContent(targetPrice, currentPrice),
    );

    await this.sendEmail(email, subject, content);
  }
}
