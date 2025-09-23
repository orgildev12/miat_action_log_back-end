import { Router } from 'express';
import { TaskOwnerController } from '../../controllers/TaskOwnerController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const taskOwnersController = new TaskOwnerController();
const { verifyToken, requireAdmin, requireSpecialAdmin, requireTaskAdmin } = authMiddleware;

// for admin
router.get('/getByHazardId/:id', verifyToken, requireAdmin, asyncHandler(taskOwnersController.getOwnersByHazardId));

// for task admin
router.post('/assign',                verifyToken, requireAdmin, asyncHandler(taskOwnersController.addOwner));
router.put('/updateOwner',            verifyToken, requireAdmin, asyncHandler(taskOwnersController.updateOwnerOrCollab));
router.put('/switchOwnerWithCollab',  verifyToken, requireTaskAdmin, asyncHandler(taskOwnersController.switchOwnerWithCollab));
router.delete('/',                    verifyToken, requireAdmin, asyncHandler(taskOwnersController.delete));

// for special admin
router.get('/getByHazardId/:id',      verifyToken, requireSpecialAdmin, asyncHandler(taskOwnersController.getOwnersByHazardId));

export default router;