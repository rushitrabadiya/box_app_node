import express from 'express';
import { groundHasCategoriesValidator } from '../validators/groundHasCategories.validator';
import { groundHasCategoriesController } from '../controllers/groundHasCategories.controller';
import { authenticateJwt, isAdmin, verifyUser } from '../middleware/authenticateJwt';

const router = express.Router();

router.post(
  '/',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  groundHasCategoriesValidator.create,
  groundHasCategoriesController.create,
);

router.get(
  '/',
  authenticateJwt,
  verifyUser,
  groundHasCategoriesValidator.getAll,
  groundHasCategoriesController.getAll,
);

router.get(
  '/:id',
  authenticateJwt,
  verifyUser,
  groundHasCategoriesValidator.getById,
  groundHasCategoriesController.getById,
);
router.put(
  '/:id',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  groundHasCategoriesValidator.update,
  groundHasCategoriesController.update,
);
router.delete(
  '/:id',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  groundHasCategoriesValidator.delete,
  groundHasCategoriesController.delete,
);

export default router;
