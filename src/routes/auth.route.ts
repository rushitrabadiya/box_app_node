import { Router } from 'express';
import { authValidator } from '../validators/auth.validator';
import { authController } from '../controllers/auth.controller';

const router = Router();

router.post('/request-otp', authValidator.validateRequestOtp, authController.requestOtp);
router.post('/verify-otp', authValidator.validateVerifyOtp, authController.verifyOtp);
router.post('/register', authValidator.validateRegister, authController.register);
router.post('/login', authValidator.validateLogin, authController.login);

export default router;
