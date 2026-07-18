import express from 'express';
import vehicleController from './vehicles.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createVehicleSchema, updateVehicleSchema } from './vehicles.validation.js';

const router = express.Router();

router.get('/', vehicleController.getAll);
router.get('/:id', vehicleController.getById);

router.use(verifyToken, authorize('ADMIN'));
router.post('/', validate(createVehicleSchema), vehicleController.create);
router.put('/:id', validate(updateVehicleSchema), vehicleController.update);
router.delete('/:id', vehicleController.delete);

export default router;
