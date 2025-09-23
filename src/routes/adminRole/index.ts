import { Router } from 'express';
import { AdminRoleController } from '../../controllers/AdmnRoleController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const adminRoleController = new AdminRoleController();
const { verifyToken, requireSuperAdmin, requireAdmin } = authMiddleware;

// // for all admins
// router.get('/',    verifyToken, requireAdmin, asyncHandler(adminController.getAll));
// router.get('/:id', verifyToken, requireAdmin, asyncHandler(adminController.getById));

// router.get('/role',    verifyToken, requireAdmin, asyncHandler(adminRoleController.getAll));
// router.get('/role/:id', verifyToken, requireAdmin, asyncHandler(adminRoleController.getById));

// // for super-admin
// router.post('/',      verifyToken, requireSuperAdmin, asyncHandler(adminController.create));
// router.put('/:id',    verifyToken, requireSuperAdmin, asyncHandler(adminController.update));
// router.delete('/:id', verifyToken, requireSuperAdmin, asyncHandler(adminController.delete));

// router.post('/role',      verifyToken, requireSuperAdmin, asyncHandler(adminRoleController.create));
// router.put('/role/:id',    verifyToken, requireSuperAdmin, asyncHandler(adminRoleController.update));
// router.delete('/role/:id', verifyToken, requireSuperAdmin, asyncHandler(adminRoleController.delete));


router.get('/:id',  asyncHandler(adminRoleController.getById));
router.get('/',    asyncHandler(adminRoleController.getAll));


router.post('/',    asyncHandler(adminRoleController.create));
router.put('/:id',    asyncHandler(adminRoleController.update));
router.delete('/:id', asyncHandler(adminRoleController.delete));

export default router;