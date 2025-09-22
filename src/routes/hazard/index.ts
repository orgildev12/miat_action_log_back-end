import { Router } from 'express';
import { HazardController } from '../../controllers/HazardController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const hazardController = new HazardController();
const { verifyToken, requireAdmin, requireSuperAdmin, requireSpecialAdmin } = authMiddleware;

// public
router.post('/', asyncHandler(hazardController.create));

router.get('/byUserId/:userId', verifyToken, asyncHandler(hazardController.getByUserId));

router.get('/:id',     verifyToken, requireAdmin, asyncHandler(hazardController.getById));
router.get('/public/', verifyToken, requireAdmin, asyncHandler(hazardController.getAllPublic));
// possible options:  /hazard/public/1?includeRef=false

router.get('/includePrivate/',  verifyToken, requireSpecialAdmin, asyncHandler(hazardController.getAllPrivate));
// possible options:  /hazard/includePrivate/?includeRef=false

router.get('/',       verifyToken, requireSuperAdmin, asyncHandler(hazardController.getAll));
router.delete('/:id', verifyToken, requireSuperAdmin, asyncHandler(hazardController.delete));
// possible options:  /hazard/1?includeRef=false?includePrivate=false


export default router;