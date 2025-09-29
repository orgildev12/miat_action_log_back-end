import { Router } from 'express';
import { UserController } from '../../controllers/UserController';
import { authMiddleware } from '../../middleware/auth';
import { asyncHandler } from '../../middleware/errorHandler/asyncHandler';

const router = Router();
const userController = new UserController();
const verifyToken = authMiddleware.verifyToken;

router.post('/', asyncHandler(userController.createUser));
router.post('/auth', asyncHandler(userController.authenticateUser));
router.get('/:id', verifyToken, asyncHandler(userController.getUserById));

export default router;