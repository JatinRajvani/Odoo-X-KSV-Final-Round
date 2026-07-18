import express from 'express';
import pController from './payments.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPaymentSchema, updatePaymentStatusSchema } from './payments.validation.js';

const router = express.Router();

router.use(verifyToken, authorize('ADMIN'));

router.post('/', validate(createPaymentSchema), pController.create);
router.get('/', pController.getAll);
router.get('/:id', pController.getById);
router.patch('/:id/status', validate(updatePaymentStatusSchema), pController.updateStatus);
router.delete('/:id', pController.delete);

export default router;
