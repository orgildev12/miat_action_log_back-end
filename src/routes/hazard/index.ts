import { Router } from 'express';
import { HazardController } from '../../controllers/HazardController';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';
import { authMiddleware } from '../../middleware/auth';

const router = Router();
const hazardController = new HazardController();
const { verifyToken, requireAdmin, requireSuperAdmin, requireSpecialAdmin } = authMiddleware;

// POST
    router.post('/noLogin', asyncHandler(hazardController.createWithoutLogin));
    router.post('/', verifyToken, asyncHandler(hazardController.create));


// GET ALL
    router.get('/', verifyToken, requireAdmin, asyncHandler(hazardController.getAllForNormalAdmins));
    // possible options:  /hazard?includeRef=true|false
    router.get('/includePrivate/', verifyToken, requireSpecialAdmin, asyncHandler(hazardController.getAllForSuperiorAdmins));
    // possible options:  /hazard?includeRef=true|false & ?includePrivate=true|false


// GET BY ID
    router.get('/:id', verifyToken, requireAdmin, asyncHandler(hazardController.getById));
    // possible options:  /hazard/1?includeRef=true|false
    router.get('/byUserId/:userId', verifyToken, asyncHandler(hazardController.getByUserId));


// ONLY SUPER ADMIN
    router.delete('/:id', verifyToken, requireSuperAdmin, asyncHandler(hazardController.delete));
    // TODO: add update method


export default router;