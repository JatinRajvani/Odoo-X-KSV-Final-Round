import express from 'express';
import invoiceController from './invoices.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateInvoiceStatusSchema } from './invoices.validation.js';

const router = express.Router();

router.use(verifyToken);

// Customer & Admin endpoints
router.get('/', invoiceController.getAll);
router.get('/:id', invoiceController.getById);
router.get('/order/:orderId', invoiceController.getByOrderId);

// Admin-only endpoints
router.patch('/:id/status', authorize('ADMIN'), validate(updateInvoiceStatusSchema), invoiceController.updateStatus);
router.delete('/:id', authorize('ADMIN'), invoiceController.delete);

export default router;
