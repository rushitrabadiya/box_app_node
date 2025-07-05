import nodemailer from 'nodemailer';
import { buildOtpEmail } from './mailer';
import axios from 'axios';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});
/**
 * Sends an email using Nodemailer.
 * @param to Recipient's email address
 * @param subject Subject of the email
 * @param html HTML content of the email
 * @param fileUrl Optional file URL (PDF or image from S3, Cloudinary, etc.)
 * @param filename Optional filename for attachment
 */
export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
  options: {
    attachments?: {
      filename: string;
      path?: string; // for local file
      url?: string; // for remote file (e.g., S3, Cloudinary)
    }[];
  } = {},
): Promise<void> => {
  const attachments: any[] = [];

  let filesToAttach = options.attachments;

  if (!filesToAttach || filesToAttach.length === 0) {
    filesToAttach = [
      {
        filename: 'default-image.jpg',
        url: 'https://res.cloudinary.com/dk8w1e0im/image/upload/v1750420930/Dynamic%20folders/suwwqzoyub1ridnlloiw.jpg',
      },
    ];
  }

  for (const file of filesToAttach) {
    if (file.path) {
      attachments.push({
        filename: file.filename,
        path: file.path,
      });
    } else if (file.url) {
      const response = await axios.get(file.url, { responseType: 'arraybuffer' });
      const contentType = response.headers['content-type'] || 'application/octet-stream';

      attachments.push({
        filename: file.filename,
        content: Buffer.from(response.data),
        contentType,
      });
    }
  }
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.AUTH_USER,
    to,
    subject,
    html,
    attachments: attachments.length > 0 ? attachments : undefined,
  };
  await transporter.sendMail(mailOptions);
};

export const sendOtpEmail = async (
  to: string,
  otp: string,
  validateTime: number = 5,
): Promise<void> => {
  const subject = 'Your OTP Code';
  const html = buildOtpEmail(otp, validateTime);
  await sendEmail(to, subject, html);
};
