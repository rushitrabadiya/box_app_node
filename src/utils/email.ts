import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendEmail = async (
  to: string,
  subject: string,
  html: string,
): Promise<void> => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};
