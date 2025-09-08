import { Router } from 'express';
import { HazardController } from '../../controllers/hazardController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler'; 

const router = Router();
const hazardController = new HazardController();

// Clean routes with automatic error handling
router.get('/', asyncHandler(hazardController.getAll));
router.post('/', asyncHandler(hazardController.create));
router.get('/:id', asyncHandler(hazardController.getById));
router.put('/:id', asyncHandler(hazardController.update));
router.delete('/:id', asyncHandler(hazardController.delete));

export default router;