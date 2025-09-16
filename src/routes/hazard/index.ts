import { Router } from 'express';
import { HazardController } from '../../controllers/HazardController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler'; 
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const hazardController = new HazardController();
const verifyToken = authMiddleware.verifyToken;

// for admin
router.get('/', asyncHandler(hazardController.getAll));
router.get('/:id', asyncHandler(hazardController.getById));
router.delete('/:id', asyncHandler(hazardController.delete));

// for user 
router.get('/byUserId/:userId', verifyToken, asyncHandler(hazardController.getByUserId));
router.post('/', verifyToken, asyncHandler(hazardController.create));

export default router;