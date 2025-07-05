import { Router } from 'express';
import { authValidator } from '../validators/auth.validator';
import { authController } from '../controllers/auth.controller';
import { authenticateJwt } from '../middleware/authenticateJwt';

const router = Router();

router.post('/request-otp', authValidator.validateRequestOtp, authController.requestOtp);
router.post('/verify-otp', authValidator.validateVerifyOtp, authController.verifyOtp);
router.post('/register', authValidator.validateRegister, authController.register);
router.post('/login', authValidator.validateLogin, authController.login);
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
