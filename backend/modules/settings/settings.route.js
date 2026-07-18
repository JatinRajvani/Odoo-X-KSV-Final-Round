import express from 'express';
import sController from './settings.controller.js';
import { verifyToken } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';
import { validate } from '../../middlewares/validate.middleware.js';
import { updateSettingsSchema } from './settings.validation.js';

const router = express.Router();
router.use(verifyToken, authorize('ADMIN'));
router.get('/', sController.getSettings);
router.put('/', validate(updateSettingsSchema), sController.updateSettings);
export default router;
