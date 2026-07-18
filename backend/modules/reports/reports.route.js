import express from 'express';
import rController from './reports.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const router = express.Router();

router.use(verifyToken, authorize('ADMIN'));

router.get('/rentals', rController.getRentals);
router.get('/revenue', rController.getRevenue);

// Export endpoints
router.get('/export/csv', rController.exportCsv);
router.get('/export/excel', rController.exportExcel);
router.get('/export/pdf', rController.exportPdf);

export default router;
