import express from 'express';
import sdController from './securityDeposits.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createDepositSchema,
  updateDepositSchema,
  refundDepositSchema
} from './securityDeposits.validation.js';

const router = express.Router();

router.use(verifyToken);

// Customer & Admin endpoints
router.get('/', sdController.getAll);
router.get('/:id', sdController.getById);

// Admin-only endpoints
router.post('/', authorize('ADMIN'), validate(createDepositSchema), sdController.create);
router.put('/:id', authorize('ADMIN'), validate(updateDepositSchema), sdController.update);
router.post('/:id/refund', authorize('ADMIN'), validate(refundDepositSchema), sdController.refund);

export default router;
