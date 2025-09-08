import { Router } from 'express';
import { LocationGroupController } from '../../controllers/LocationGroupController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';

const router = Router();
const locationGroupController = new LocationGroupController();

// Clean routes with automatic error handling
router.get('/', asyncHandler(locationGroupController.getAll));
router.post('/', asyncHandler(locationGroupController.create));
router.get('/:id', asyncHandler(locationGroupController.getById));
router.put('/:id', asyncHandler(locationGroupController.update));
router.delete('/:id', asyncHandler(locationGroupController.delete));

export default router;