import express from 'express';
import pController from './payments.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import {
  createPaymentSchema,
  updatePaymentStatusSchema,
  paySchema
} from './payments.validation.js';

const router = express.Router();

router.use(verifyToken);

// Customer & Admin endpoints
router.post('/', validate(createPaymentSchema), pController.create);
router.post('/:id/pay', validate(paySchema), pController.pay);
router.get('/', pController.getAll);
router.get('/:id', pController.getById);

// Admin-only endpoints
router.patch('/:id/status', authorize('ADMIN'), validate(updatePaymentStatusSchema), pController.updateStatus);
router.delete('/:id', authorize('ADMIN'), pController.delete);

export default router;
