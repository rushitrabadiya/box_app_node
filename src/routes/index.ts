import { Router } from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import categoryRoute from './category.route';

const router = Router();
router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/category', categoryRoute);

export default router;
