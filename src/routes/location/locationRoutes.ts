import { Router } from 'express';
import { LocationController } from '../../controllers/LocationController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';

const router = Router();
const locationController = new LocationController();

// Clean routes with automatic error handling
router.get('/', asyncHandler(locationController.getAll));
router.post('/', asyncHandler(locationController.create));
router.get('/:id', asyncHandler(locationController.getById));
router.put('/:id', asyncHandler(locationController.update));
router.delete('/:id', asyncHandler(locationController.delete));

export default router;