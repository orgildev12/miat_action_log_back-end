import { Router } from 'express';
import { HazardController } from '../../controllers/HazardController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler'; 

const router = Router();
const hazardController = new HazardController();

router.get('/', asyncHandler(hazardController.getAll));
router.get('/:id', asyncHandler(hazardController.getById));
router.post('/', asyncHandler(hazardController.create));
router.delete('/:id', asyncHandler(hazardController.delete));


export default router;