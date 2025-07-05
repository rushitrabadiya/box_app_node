import { Router } from 'express';
import { authValidator } from '../validators/auth.validator';
import { authController } from '../controllers/auth.controller';
import { authenticateJwt } from '../middleware/authenticateJwt';

const router = Router();

router.post('/request-otp', authValidator.validateRequestOtp, authController.requestOtp);
router.post('/verify-otp', authValidator.validateVerifyOtp, authController.verifyOtp);
router.post('/register', authValidator.validateRegister, authController.register);
router.post('/login', authValidator.validateLogin, authController.login);
router.get('/reset-password/:token', (req, res) => {
  const { token } = req.params;
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <title>Reset Password</title>
      </head>
      <body style="font-family: Arial; text-align: center; margin-top: 100px;">
        <h2>Reset Your Password</h2>
        <form method="POST" action="/api/v1/auth/reset-password/${token}">
          <input type="password" name="newPassword" placeholder="New Password" required style="padding: 8px; width: 200px;" />
          <br/><br/>
          <button type="submit" style="padding: 10px 20px;">Reset Password</button>
        </form>
      </body>
    </html>
  `;
  res.send(html);
});
router.post('/reset-password/:token', authValidator.resetToken, authController.resetPassword);
router.post(
  '/refresh-token',
  authenticateJwt,
  authValidator.validateRefreshToken,
  authController.refreshToken,
);
router.post(
  '/forgot-password',
  authValidator.validateForgotPassword,
  authController.forgotPassword,
);
router.post('/logout', authenticateJwt, authValidator.validateLogout, authController.logout);
router.post(
  '/change-password',
  authenticateJwt,
  authValidator.validateChangePassword,
  authController.changePassword,
);

export default router;
