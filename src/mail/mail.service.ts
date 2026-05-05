import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  async sendTicketQrCodes(
    to: string,
    tickets: { id: string; qr_code: string; first_name?: string | null }[],
  ) {
    const attachments = await Promise.all(
      tickets.map(async (t, i) => {
        const buffer = await QRCode.toBuffer(t.qr_code);
        return {
          filename: `ticket-${i + 1}.png`,
          content: buffer,
          cid: `ticket${i}`,
        };
      }),
    );

    const html = `
      <h2>Your Tickets</h2>
      ${tickets.map((t, i) => `
        <div>
          <p>${t.first_name ? `Name: ${t.first_name}` : `Ticket ${i + 1}`}</p>
          <img src="cid:ticket${i}" alt="QR Code" />
        </div>
      `).join('')}
    `;

    await this.transporter.sendMail({
      from: `"GREEN Events" <${process.env.GOOGLE_EMAIL}>`,
      to,
      subject: 'Your Event Tickets',
      html,
      attachments,
    });
  }
}