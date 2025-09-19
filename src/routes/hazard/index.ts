import { Router } from 'express';
import { HazardController } from '../../controllers/HazardController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const hazardController = new HazardController();
const { verifyToken, requireAdmin, requireSuperAdmin, requireSpecialAdmin } = authMiddleware;

// public
router.post('/', verifyToken, asyncHandler(hazardController.create));

// for user
router.get('/byUserId/:userId', verifyToken, asyncHandler(hazardController.getByUserId));

// for admin
router.get('/?includeRef=true?includePrivate=false',  verifyToken, requireAdmin, asyncHandler(hazardController.getAll));
router.get('/?includeRef=false?includePrivate=false', verifyToken, requireAdmin, asyncHandler(hazardController.getAll));
router.get('/:id?includeRef=false?includePrivate=false', verifyToken, requireAdmin, asyncHandler(hazardController.getById));
router.get('/:id?includeRef=true?includePrivate=false', verifyToken, requireAdmin, asyncHandler(hazardController.getById));

// for special-admin
router.get('/?includeRef=true?includePrivate=true',  verifyToken, requireSpecialAdmin, asyncHandler(hazardController.getAll));
router.get('/?includeRef=false?includePrivate=true', verifyToken, requireSpecialAdmin, asyncHandler(hazardController.getAll));
router.get('/:id?includeRef=false?includePrivate=true', verifyToken, requireAdmin, asyncHandler(hazardController.getById));
router.get('/:id?includeRef=true?includePrivate=true', verifyToken, requireAdmin, asyncHandler(hazardController.getById));

router.delete('/:id', verifyToken, requireSuperAdmin, asyncHandler(hazardController.delete));

export default router;