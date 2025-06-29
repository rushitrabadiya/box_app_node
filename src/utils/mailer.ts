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

export const buildOtpEmail = (otp: string): string => `
  <p>Your verification code is:</p>
  <h2 style="letter-spacing:3px">${otp}</h2>
  <p>This code expires in 5 minutes.</p>
`;

export const buildResetPasswordEmail = (resetLink: string): string => `
  <p>You requested a password reset.</p>
  <p>Click <a href="${resetLink}">here</a> to reset your password.</p>
`;
