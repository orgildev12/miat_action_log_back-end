import { Router } from 'express';
import { ResponseController } from '../../controllers/ResponseController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler'; 
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const responseController = new ResponseController();
const { verifyToken, requireAdmin, requireResponseAdmin, requireAuditAdmin, requireTaskAdmin } = authMiddleware;

// for admin (public hazards)
router.get('/', verifyToken,  requireAdmin, asyncHandler(responseController.getAll));
router.get('/:id', verifyToken, requireAdmin, asyncHandler(responseController.getById));

// for response admin (public hazards)
router.put('/:id/start-analysis',  verifyToken, requireResponseAdmin, asyncHandler(responseController.startAnalysis));
router.put('/:id/update-body',   verifyToken, requireResponseAdmin, asyncHandler(responseController.updateResponseBody));
router.put('/:id/approve-request', verifyToken, requireResponseAdmin, asyncHandler(responseController.approveRequest));
router.put('/:id/deny-request',    verifyToken, requireResponseAdmin, asyncHandler(responseController.denyRequest));
router.put('/:id/finish-analysis', verifyToken, requireResponseAdmin, asyncHandler(responseController.finishAnalysis));

// for audit admin (public hazards)
router.put('/:id/confirm-response', verifyToken, requireAuditAdmin, asyncHandler(responseController.confirmResponse));
router.put('/:id/deny-response',    verifyToken, requireAuditAdmin, asyncHandler(responseController.denyResponse));


// TODO: add routes for special admin
// router.put('/:id/start-analysis',  verifyToken, requireResponseAdmin, asyncHandler(responseController.startAnalysis));
// router.put('/:id/response-body',   verifyToken, requireResponseAdmin, asyncHandler(responseController.updateResponseBody));
// router.put('/:id/approve-request', verifyToken, requireResponseAdmin, asyncHandler(responseController.approveRequest));
// router.put('/:id/deny-request',    verifyToken, requireResponseAdmin, asyncHandler(responseController.denyRequest));
// router.put('/:id/finish-analysis', verifyToken, requireResponseAdmin, asyncHandler(responseController.finishAnalysis));

// Create, delete үйлдэл database дээр trigger-ээр зохицуулагдана.

export default router;