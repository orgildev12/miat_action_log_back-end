import { Router } from 'express';
import { AdminController } from '../../controllers/AdminController';
import { AdminRoleController } from '../../controllers/AdmnRoleController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const adminController = new AdminController();
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



// for all admins
router.get('/',    asyncHandler(adminController.getAll));
router.get('/:id', asyncHandler(adminController.getById));

// for super-admin
router.post('/',      asyncHandler(adminController.create));
router.put('/:id',    verifyToken, requireAdmin, asyncHandler(adminController.update));
router.delete('/:id', asyncHandler(adminController.delete));


export default router;