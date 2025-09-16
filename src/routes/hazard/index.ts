import { Router } from 'express';
import { HazardController } from '../../controllers/hazardController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const hazardController = new HazardController();
const { verifyToken, requireAdmin, requireSuperAdmin } = authMiddleware;

// public
router.post('/', verifyToken, asyncHandler(hazardController.create));

// for user
router.get('/byUserId/:userId', verifyToken, asyncHandler(hazardController.getByUserId));

// for admin
router.get('/',       verifyToken, requireAdmin,      asyncHandler(hazardController.getAll));
router.get('/:id',    verifyToken, requireAdmin,      asyncHandler(hazardController.getById));
// TODO: implement include reference, private hazards options and make it separate route

router.delete('/:id', verifyToken, requireSuperAdmin, asyncHandler(hazardController.delete));


export default router;