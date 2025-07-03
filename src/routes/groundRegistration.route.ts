import express from 'express';
import { groundRegistrationValidator } from '../validators/groundRegistration.validator';
import { groundRegistrationController } from '../controllers/groundRegistration.controller';
import { authenticateJwt, isAdmin, verifyUser } from '../middleware/authenticateJwt';

const router = express.Router();

router.post(
  '/',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  groundRegistrationValidator.create,
  groundRegistrationController.createGround,
);
router.get(
  '/',
  authenticateJwt,
  verifyUser,
  groundRegistrationValidator.getAll,
  groundRegistrationController.getAllGrounds,
);

router.get(
  '/:id',
  authenticateJwt,
  verifyUser,
  groundRegistrationValidator.getById,
  groundRegistrationController.getGroundById,
);
router.put(
  '/:id',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  groundRegistrationValidator.update,
  groundRegistrationController.updateGround,
);
router.delete(
  '/:id',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  groundRegistrationValidator.delete,
  groundRegistrationController.deleteGround,
);

export default router;
