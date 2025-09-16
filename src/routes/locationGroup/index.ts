import { Router } from 'express';
import { LocationGroupController } from '../../controllers/LocationGroupController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const locationGroupController = new LocationGroupController();
const { verifyToken, requireSuperAdmin } = authMiddleware;

// public
router.get('/',    asyncHandler(locationGroupController.getAll));
router.get('/:id', asyncHandler(locationGroupController.getById));

// for admin
router.post('/',      verifyToken, requireSuperAdmin, asyncHandler(locationGroupController.create));
router.put('/:id',    verifyToken, requireSuperAdmin, asyncHandler(locationGroupController.update));
router.delete('/:id', verifyToken, requireSuperAdmin, asyncHandler(locationGroupController.delete));

export default router;