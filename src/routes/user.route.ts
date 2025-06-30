import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { userValidator } from '../validators/user.validator';
import { authenticateJwt, verifyUser } from '../middleware/authenticateJwt';

const router = Router();

router.post('/', userValidator.validateUser, userController.createUser);
router.get('/:id', authenticateJwt, verifyUser, userController.getUser);
router.get('/current', authenticateJwt, verifyUser, userController.getCurrentUser);
router.get('/', authenticateJwt, verifyUser, userController.getAllUsers);
router.put(
  '/:id',
  authenticateJwt,
  verifyUser,
  userValidator.validateUser,
  userController.updateUser,
);
router.delete('/:id', authenticateJwt, verifyUser, userController.deleteUser);

export default router;
