import express from 'express';
import pController from './penalties.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createPenaltySchema, updatePenaltySchema, calculatePenaltiesSchema } from './penalties.validation.js';

const router = express.Router();

router.use(verifyToken, authorize('ADMIN'));

router.post('/', validate(createPenaltySchema), pController.create);
router.post('/calculate', validate(calculatePenaltiesSchema), pController.calculate);
router.post('/check-closure/:rentalOrderId', pController.checkClosure);

router.get('/', pController.getAll);
router.get('/:id', pController.getById);
router.put('/:id', validate(updatePenaltySchema), pController.update);
router.delete('/:id', pController.delete);

export default router;
