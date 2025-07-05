interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

// For now this is just a stub that logs to console.
// Swap with nodemailer / SES / Sendgrid etc later.
export const sendEmail = async ({ to, subject, html }: SendEmailOptions): Promise<void> => {
  console.log('--- Email Preview ----');
  console.log('To:', to);
  console.log('Subject:', subject);
  console.log('HTML:', html);
  console.log('-----------------------');
};

export const buildOtpEmail = (otp: string, validateTime: number): string => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #333;">Email Verification Code</h2>
    <p style="font-size: 16px; color: #555;">Please use the following code to verify your email address:</p>
    <div style="margin: 20px 0; text-align: center;">
      <span style="display: inline-block; background: #f4f4f4; padding: 15px 25px; font-size: 24px; font-weight: bold; color: #2c3e50; border-radius: 5px; letter-spacing: 5px;">${otp}</span>
    </div>
    <p style="font-size: 14px; color: #999;">This code is valid for <strong>${validateTime} minutes</strong>.</p>
    <p style="font-size: 14px; color: #999;">If you did not request this, please ignore this email.</p>
    <hr style="margin-top: 30px;">
    <p style="font-size: 12px; color: #ccc;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
`;

export const buildResetPasswordEmail = (resetLink: string, validateTime: number): string => `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
    <h2 style="color: #333;">Password Reset Request</h2>
    <p style="font-size: 16px; color: #555;">We received a request to reset your password.</p>
    <div style="margin: 20px 0;">
      <a href="${resetLink}" style="display: inline-block; background-color: #007BFF; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">
        Reset Password
      </a>
    </div>
    <p style="font-size: 14px; color: #999;">This link is valid for <strong>${validateTime} minutes</strong>.</p>
    <p style="font-size: 14px; color: #999;">If you did not request this password reset, please ignore this email.</p>
    <hr style="margin-top: 30px;">
    <p style="font-size: 12px; color: #ccc;">&copy; ${new Date().getFullYear()} Your Company. All rights reserved.</p>
  </div>
`;
