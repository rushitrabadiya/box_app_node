import { Router } from 'express';
import userRoute from './user.route';
import authRoute from './auth.route';
import categoryRoute from './category.route';
import groundRegistrationRoute from './groundRegistration.route';
import groundHasCategoriesRoute from './groundHasCategories.route';
import slotRoute from './slot.route';

const router = Router();
router.use('/users', userRoute);
router.use('/auth', authRoute);
router.use('/category', categoryRoute);
router.use('/groundRegistration', groundRegistrationRoute);
router.use('/groundHasCategories', groundHasCategoriesRoute);
router.use('/slot', slotRoute);

export default router;
