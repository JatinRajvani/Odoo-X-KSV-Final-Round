import express from 'express';
import categoryController from './categories.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { createCategorySchema, updateCategorySchema } from './categories.validation.js';

const router = express.Router();

// Public routes
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);

// Admin routes
router.use(verifyToken, authorize('ADMIN'));
router.post('/', validate(createCategorySchema), categoryController.create);
router.put('/:id', validate(updateCategorySchema), categoryController.update);
router.delete('/:id', categoryController.delete);

export default router;
