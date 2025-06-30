import nodemailer from 'nodemailer';
import { buildOtpEmail } from './mailer';
import dotenv from 'dotenv';

// const transporter = nodemailer.createTransport({
//   host: process.env.SMTP_HOST,
//   port: parseInt(process.env.SMTP_PORT || '587'),
//   secure: process.env.SMTP_SECURE === 'true',
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASSWORD,
//   },
// });
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
 */
export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  const mailOptions = {
    from: process.env.SMTP_FROM || process.env.AUTH_USER,
    to,
    subject,
    html,
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
