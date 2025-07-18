import express from 'express';
import { categoryValidator } from '../validators/categories.validator';
import { categoryController } from '../controllers/category.controller';
import { authenticateJwt, isAdmin, verifyUser } from '../middleware/authenticateJwt';

const router = express.Router();

router.post(
  '/',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  categoryValidator.createCategory,
  categoryController.createCategory,
);
router.get(
  '/',
  authenticateJwt,
  verifyUser,
  categoryValidator.getAllCategories,
  categoryController.getAllCategories,
);
router.get(
  '/:id',
  authenticateJwt,
  verifyUser,
  categoryValidator.getCategoryById,
  categoryController.getCategory,
);
router.put(
  '/:id',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  categoryValidator.updateCategory,
  categoryController.updateCategory,
);
router.delete(
  '/:id',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  categoryValidator.deleteCategory,
  categoryController.deleteCategory,
);

export default router;
