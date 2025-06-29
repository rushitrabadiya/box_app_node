import { Router } from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';

const router = Router();
router.use('/users', userRoute);
router.use('/auth', authRoute);

export default router;
