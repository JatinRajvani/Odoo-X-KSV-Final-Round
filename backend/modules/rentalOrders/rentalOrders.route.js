import express from 'express';
import roController from './rentalOrders.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createRentalOrderSchema,
  updateRentalOrderSchema,
  updateOrderStatusSchema,
  pickupOrderSchema,
  returnOrderSchema
} from './rentalOrders.validation.js';

const router = express.Router();

router.use(verifyToken);

router.post('/', validate(createRentalOrderSchema), roController.create);
router.get('/', roController.getAll);
router.get('/:id', roController.getById);

// Update order details (only allowed if order is Pending)
router.put('/:id', validate(updateRentalOrderSchema), roController.update);

// Basic status state updates (Confirming, Cancelling)
router.patch('/:id/status', validate(updateOrderStatusSchema), roController.updateStatus);

// Operations Flow endpoints
router.patch('/:id/pickup', validate(pickupOrderSchema), roController.pickup);
router.patch('/:id/return', authorize('ADMIN'), validate(returnOrderSchema), roController.returnVehicle);

router.delete('/:id', roController.delete);

export default router;
