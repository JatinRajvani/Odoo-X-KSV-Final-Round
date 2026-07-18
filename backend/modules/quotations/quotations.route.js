import express from 'express';
import qController from './quotations.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.use(verifyToken);

// Mount point will be /api
router.post('/quotations/generate/:rentalOrderId', authorize('ADMIN'), qController.generate);
router.get('/quotations/:id', qController.getById);
router.get('/rental-orders/:id/quotation', qController.getByOrderId);

export default router;
