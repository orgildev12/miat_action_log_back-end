import { Router } from 'express';
import { HazardTypeController } from '../../controllers/HazardTypeController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';

const router = Router();
const hazardTypeController = new HazardTypeController();

// Clean routes with automatic error handling
router.get('/', asyncHandler(hazardTypeController.getAll));
router.post('/', asyncHandler(hazardTypeController.create));
router.get('/:id', asyncHandler(hazardTypeController.getById));
router.put('/:id', asyncHandler(hazardTypeController.update));
router.delete('/:id', asyncHandler(hazardTypeController.delete));

export default router;