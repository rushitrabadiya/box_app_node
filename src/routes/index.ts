import { Router } from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import categoryRoute from './category.route';
import groundRegistrationRoute from './groundRegistration.route';

const router = Router();
router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/category', categoryRoute);
router.use('/groundRegistration', groundRegistrationRoute);

export default router;
