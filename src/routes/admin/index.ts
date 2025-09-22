import { Router } from 'express';
import { AdminController } from '../../controllers/adminController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const adminController = new AdminController();
const { verifyToken, requireSuperAdmin, requireAdmin } = authMiddleware;

// for all admins
router.get('/',    verifyToken, requireAdmin, asyncHandler(adminController.getAll));
router.get('/:id', verifyToken, requireAdmin, asyncHandler(adminController.getById));

// for super-admin
router.post('/',      verifyToken, requireSuperAdmin, asyncHandler(adminController.create));
router.put('/:id',    verifyToken, requireSuperAdmin, asyncHandler(adminController.update));
router.delete('/:id', verifyToken, requireSuperAdmin, asyncHandler(adminController.delete));

export default router;