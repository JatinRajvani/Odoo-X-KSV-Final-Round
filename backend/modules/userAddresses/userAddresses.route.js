import express from 'express';
import addressController from './userAddresses.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createAddressSchema, updateAddressSchema } from './userAddresses.validation.js';

const router = express.Router();

// All address routes require user authentication
router.use(verifyToken);

router.post('/', validate(createAddressSchema), addressController.create);
router.get('/', addressController.getAll);
router.get('/:id', addressController.getById);
router.put('/:id', validate(updateAddressSchema), addressController.update);
router.delete('/:id', addressController.delete);

export default router;
