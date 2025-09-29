import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { UserService } from '../services/UserService';
import { User } from '../models/User';
import { ValidationError, NotFoundError, AuthError, ForbiddenError } from '../middleware/errorHandler/errorTypes';
import { authMiddleware } from '../middleware/auth';

export class UserController {
    private userService = new UserService();

    createUser = async (req: Request, res: Response): Promise<void> => {
        const crypto = require('crypto');
        const requestData: typeof User.modelFor.createRequest = { ...req.body };
        const result = await this.userService.getUserByUsername(requestData.user_name);
        if (result) {
            throw new AuthError('Username already exists');
        }
        if (requestData.password) {
            requestData.password = crypto.createHash('md5').update(requestData.password).digest('hex');
        }
        if (requestData.pin) {
            requestData.pin = crypto.createHash('md5').update(requestData.pin).digest('hex');
        }
        const createdUser = await this.userService.create(requestData);
        res.status(201).json(createdUser.toJSON());
    };

    authenticateUser = async (req: Request, res: Response): Promise<void> => {
        const requestData = req.body as typeof User.modelFor.authRequest;
        const validation = User.validateAuthRequest(requestData);
        if (!validation.isValid) {
            throw new ValidationError(validation.errors);
        }

        const result = await this.userService.getUserByUsername(requestData.user_name);
        if (!result) {
            throw new AuthError('Username or password is incorrect');
        }

        const crypto = require('crypto');
        const passwordHash = crypto.createHash('md5').update(requestData.password).digest('hex');
        const isPasswordValid = passwordHash === result.passwordHash;
        if (!isPasswordValid) {
            throw new AuthError('Username or password is incorrect');
        }

        const token = authMiddleware.generateToken(result.user.toJSON());
        res.status(200).json({
            success: true,
            message: 'Authentication successful',
            data: {
                user: result.user.toJSON(),
                token: token
            }
        });
    };

    getUserById = async (req: Request, res: Response): Promise<void> => {
        const requestedId = Number(req.params.id);
        
        if (req.user!.id !== requestedId) {
            throw new ForbiddenError('Access denied');
        }
        
        const user = await this.userService.getById(requestedId);
        res.status(200).json(user.toJSON());
    };
}