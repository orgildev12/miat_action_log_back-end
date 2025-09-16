import { Router } from 'express';
import { LocationController } from '../../controllers/LocationController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const locationController = new LocationController();
const { verifyToken, requireSuperAdmin } = authMiddleware;

// public
// TODO: implement include reference option and make it separate route
router.get('/',    asyncHandler(locationController.getAll));
router.get('/:id', asyncHandler(locationController.getById));

// for admin
router.post('/',      verifyToken, requireSuperAdmin, asyncHandler(locationController.create));
router.put('/:id',    verifyToken, requireSuperAdmin, asyncHandler(locationController.update));
router.delete('/:id', verifyToken, requireSuperAdmin, asyncHandler(locationController.delete));

export default router;