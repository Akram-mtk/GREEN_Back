import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import * as QRCode from 'qrcode';

export interface TicketEmailData {
  id: string;
  qr_code: string;
  first_name?: string | null;
  last_name?: string | null;
  is_minor?: boolean;
  parent_first_name?: string | null;
  parent_last_name?: string | null;
  match_name?: string;
  match_date?: string;
  match_time?: string;
  area_name?: string;
  team_name?: string;
}

@Injectable()
export class MailService {
  private transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GOOGLE_EMAIL,
      pass: process.env.GOOGLE_PASSWORD,
    },
  });

  async sendTicketQrCodes(to: string, tickets: TicketEmailData[]) {
    const attachments: { filename: string; content: Buffer; cid: string }[] = [];

    for (let i = 0; i < tickets.length; i++) {
      const buffer = await QRCode.toBuffer(tickets[i].qr_code, { width: 200, margin: 1 });
      attachments.push({ filename: `qr-${i}.png`, content: buffer, cid: `qr-code-${i}` });
    }

    const ticketsHtml = tickets.map((ticket, i) => {
      const name = `${ticket.first_name || ''} ${ticket.last_name || ''}`.trim() || 'Supporter';
      const typeLabel = ticket.is_minor ? '👶 MINEUR' : '👤 ADULTE';
      const typeBg = ticket.is_minor ? '#dc2626' : '#0f4f1e';

      const parentHtml = ticket.is_minor && ticket.parent_first_name
        ? `<div style="background:#fef3c7;border:1px solid #f59e0b;border-radius:6px;padding:8px 14px;margin:12px 0;font-size:13px;color:#92400e">
            👤 Accompagné par : <strong>${ticket.parent_first_name} ${ticket.parent_last_name || ''}</strong>
          </div>`
        : '';

      return `
        <div style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden;margin-bottom:24px;max-width:600px">
          <!-- Header -->
          <div style="background:linear-gradient(90deg,#0f4f1e,#1a5f2e);padding:16px 24px">
            <table width="100%"><tr>
              <td><span style="color:#D6B35B;font-weight:900;font-size:16px">${ticket.team_name || "MOULOUDIA CLUB D'ALGER"}</span><br/><span style="color:rgba(255,255,255,0.7);font-size:11px">Stade de Ali AMMAR Dit Ali La Pointe</span></td>
              <td style="text-align:right"><span style="color:#D6B35B;font-weight:bold;font-size:12px">TICKET ${i + 1}/${tickets.length}</span><br/><span style="background:${typeBg};color:white;font-size:11px;padding:2px 8px;border-radius:4px;display:inline-block;margin-top:4px">${typeLabel}</span></td>
            </tr></table>
          </div>

          <!-- Match info -->
          <div style="background:linear-gradient(135deg,#0a2e14,#1a3d2a);padding:16px 24px">
            <p style="color:white;font-weight:900;font-size:18px;margin:0 0 4px">${ticket.match_name || ''}</p>
            <p style="color:#D6B35B;font-size:13px;margin:0">${ticket.match_date || ''} · ${ticket.match_time || ''} · Tribune ${ticket.area_name || ''}</p>
          </div>

          <!-- Body -->
          <div style="padding:20px 24px">
            <table width="100%"><tr>
              <!-- Info -->
              <td style="vertical-align:top">
                <p style="color:#6b7280;font-size:10px;text-transform:uppercase;letter-spacing:1px;margin:0 0 4px">${ticket.is_minor ? 'Nom du mineur' : 'Nom du supporter'}</p>
                <p style="color:#111;font-weight:900;font-size:24px;margin:0 0 8px;line-height:1">${name}</p>
                ${parentHtml}
                <table style="margin-top:8px">
                  <tr><td style="color:#6b7280;font-size:10px;text-transform:uppercase;padding:4px 16px 4px 0">Tribune</td><td style="color:#6b7280;font-size:10px;text-transform:uppercase;padding:4px 0">Statut</td></tr>
                  <tr><td style="color:#111;font-weight:700;font-size:14px;padding:0 16px 0 0">${ticket.area_name || ''}</td><td style="color:#166534;font-weight:700;font-size:13px">✓ Confirmé</td></tr>
                </table>
                <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:8px 12px;margin-top:12px">
                  <p style="color:#166534;font-size:11px;margin:0">⚠️ Valable pour une seule entrée — Présentez ce QR code à l'entrée du stade</p>
                </div>
              </td>
              <!-- QR -->
              <td style="vertical-align:top;text-align:center;width:140px;padding-left:16px">
                <div style="background:white;padding:6px;border:2px solid #e5e7eb;border-radius:8px;display:inline-block">
                  <img src="cid:qr-code-${i}" width="130" height="130" style="display:block" />
                </div>
                <p style="color:#9ca3af;font-size:10px;margin:6px 0 0">Scanner à l'entrée</p>
              </td>
            </tr></table>
          </div>

          <!-- Footer -->
          <div style="border-top:1px dashed #d1d5db;padding:8px 24px;background:#f9fafb;text-align:center">
            <p style="color:#9ca3af;font-size:10px;margin:0">© ${new Date().getFullYear()} Mouloudia Club d'Alger · Stade de Ali AMMAR Dit Ali La Pointe</p>
          </div>
        </div>`;
    }).join('');

    const html = `<div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;padding:20px;background:#f3f4f6">${ticketsHtml}</div>`;

    await this.transporter.sendMail({
      from: `"MCA Tickets" <${process.env.GOOGLE_EMAIL}>`,
      to,
      subject: `🎫 Vos tickets — ${tickets[0]?.match_name || 'Match'}`,
      html,
      attachments,
    });
  }
}
