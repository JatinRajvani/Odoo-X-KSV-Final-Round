import express from 'express';
import sdController from './securityDeposits.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createDepositSchema, updateDepositSchema, refundDepositSchema } from './securityDeposits.validation.js';

const router = express.Router();

router.use(verifyToken, authorize('ADMIN'));

router.post('/', validate(createDepositSchema), sdController.create);
router.get('/', sdController.getAll);
router.get('/:id', sdController.getById);
router.put('/:id', validate(updateDepositSchema), sdController.update);
router.patch('/:id/refund', validate(refundDepositSchema), sdController.refund);

export default router;
