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
    tickets: Array<{
      id: string;
      qr_code: string;
      first_name?: string | null;
      match_name?: string;
      match_date?: string;
      match_time?: string;
      area_name?: string;
      team_name?: string;
    }>,
  ) {
    for (const ticket of tickets) {
      const buffer = await QRCode.toBuffer(ticket.qr_code);

      const html = `<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
  <div style="background:linear-gradient(90deg,#0f4f1e,#1a5f2e);padding:16px 24px;display:flex;align-items:center;gap:12px">
    <div style="color:#D6B35B;font-weight:900;font-size:16px">${ticket.team_name}</div>
  </div>
  <div style="padding:24px">
    <h2 style="color:#111;margin:0 0 16px">🎫 Votre Ticket</h2>
    <table style="width:100%;border-collapse:collapse">
      <tr><td style="color:#6b7280;padding:6px 0">Match</td><td style="font-weight:600">${ticket.match_name}</td></tr>
      <tr><td style="color:#6b7280;padding:6px 0">Date</td><td style="font-weight:600">${ticket.match_date}</td></tr>
      <tr><td style="color:#6b7280;padding:6px 0">Heure</td><td style="font-weight:600">${ticket.match_time}</td></tr>
      <tr><td style="color:#6b7280;padding:6px 0">Tribune</td><td style="font-weight:600">${ticket.area_name}</td></tr>
      <tr><td style="color:#6b7280;padding:6px 0">Nom</td><td style="font-weight:600">${ticket.first_name || ''}</td></tr>
    </table>
    <div style="text-align:center;margin:24px 0">
      <img src="cid:qr-code" style="width:200px;height:200px" />
      <p style="color:#6b7280;font-size:12px">Présentez ce QR code à l'entrée du stade</p>
    </div>
    <div style="background:#f9fafb;border-radius:6px;padding:12px;text-align:center;color:#6b7280;font-size:12px">
      Stade de Ali AMMAR Dit Ali La Pointe · © 2025 Mouloudia Club d'Alger
    </div>
  </div>
</div>`;

      await this.transporter.sendMail({
        from: `"GREEN Events" <${process.env.GOOGLE_EMAIL}>`,
        to,
        subject: 'Your Event Ticket',
        html,
        attachments: [
          {
            filename: `ticket.png`,
            content: buffer,
            cid: 'qr-code',
          },
        ],
      });
    }
  }
}