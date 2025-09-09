import { Router } from 'express';
import { HazardController } from '../../controllers/HazardController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler'; 

const router = Router();
const hazardController = new HazardController();

// Clean routes with automatic error handling
router.get('/', asyncHandler(hazardController.getAll));
router.get('/:id', asyncHandler(hazardController.getById));
router.post('/', asyncHandler(hazardController.create));
router.delete('/:id', asyncHandler(hazardController.delete));

router.put('/:id/start-analysis', asyncHandler(hazardController.startAnalysis));
router.put('/:id/approve-request', asyncHandler(hazardController.approveRequest));
router.put('/:id/deny-request', asyncHandler(hazardController.denyRequest));
router.put('/:id/start-checking', asyncHandler(hazardController.startChecking));
router.put('/:id/confirm-response', asyncHandler(hazardController.confirmResponse));
router.put('/:id/deny-response', asyncHandler(hazardController.denyResponse));

export default router;