import { Router } from 'express';
import { ResponseController } from '../../controllers/ResponseController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler'; 

const router = Router();
const responseController = new ResponseController();

router.get('/', asyncHandler(responseController.getAll));
router.get('/:id', asyncHandler(responseController.getById));

router.put('/:id/start-analysis', asyncHandler(responseController.startAnalysis));
router.put('/:id/approve-request', asyncHandler(responseController.approveRequest));
router.put('/:id/deny-request', asyncHandler(responseController.denyRequest));
router.put('/:id/finish-analysis', asyncHandler(responseController.finishAnalysis));
router.put('/:id/start-checking', asyncHandler(responseController.startChecking));
router.put('/:id/confirm-response', asyncHandler(responseController.confirmResponse));
router.put('/:id/deny-response', asyncHandler(responseController.denyResponse));

// Бусад үйлдэл database дээр trigger-ээр зохицуулагдана.

export default router;