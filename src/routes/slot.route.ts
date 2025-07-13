import { Slot } from './../models/mongo/slot.model';
import express from 'express';
import { slotValidator } from '../validators/slot.validator';
import { slotController } from '../controllers/slot.controller';
import { authenticateJwt, isAdmin, verifyUser } from '../middleware/authenticateJwt';

const router = express.Router();

router.post(
  '/',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  slotValidator.createSlot,
  slotController.create,
);
router.post(
  '/auto-generation-slot',
  authenticateJwt,
  verifyUser,
  // isAdmin,
  slotValidator.autoSlotGeneration,
  slotController.autoSlotGeneration,
);
router.get('/', authenticateJwt, verifyUser, slotValidator.getAllSlot, slotController.getAll);
router.get('/:id', authenticateJwt, verifyUser, slotValidator.getSlotById, slotController.getById);
router.put(
  '/:id',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  slotValidator.updateSlot,
  slotController.update,
);
router.delete(
  '/:id',
  authenticateJwt,
  verifyUser,
  //   isAdmin,
  slotValidator.deleteSlot,
  slotController.delete,
);

export default router;
