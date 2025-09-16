import { Router } from 'express';
import { HazardTypeController } from '../../controllers/HazardTypeController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const hazardTypeController = new HazardTypeController();
const { verifyToken, requireAdmin, requireSuperAdmin } = authMiddleware;

// public
router.get('/', asyncHandler(hazardTypeController.getAll));
router.get('/:id', asyncHandler(hazardTypeController.getById));

// for admin
router.post('/',      verifyToken, requireSuperAdmin, asyncHandler(hazardTypeController.create));
router.put('/:id',    verifyToken, requireSuperAdmin, asyncHandler(hazardTypeController.update));
router.delete('/:id', verifyToken, requireSuperAdmin, asyncHandler(hazardTypeController.delete));

export default router;