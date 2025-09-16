import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { NotFoundError, AuthError } from '../middleware/errorHandler/errorTypes';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                username: string;
            };
        }
    }
}

export class AuthMiddleware {
    private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

    generateToken = (user: any): string => {
        const payload = {
            id: user.id,
            username: user.username
        };

        return jwt.sign(payload, this.JWT_SECRET, { 
            expiresIn: '1h',
            issuer: 'miat-action-log'
        });
    };

    verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new AuthError('Access token required');
        }

        const token = authHeader.substring(7); // Removing 'Bearer '

        try {
            const decoded = jwt.verify(token, this.JWT_SECRET) as any;
            
            req.user = {
                id: decoded.id,
                username: decoded.username
            };

            next();
        } catch (jwtError) {
            throw new AuthError('Invalid or expired token');
        }
    };
}

export const authMiddleware = new AuthMiddleware();