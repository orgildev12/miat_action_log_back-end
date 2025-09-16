import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserService } from '../services/UserService';
import { AuthError, ForbiddenError } from '../middleware/errorHandler/errorTypes';
import { AdminService } from '../services/adminService';

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
    private adminService = new AdminService;

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

    allowRole = (allowedRoles: string[]) => {
        return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
            const userId = req.user.id;
            const admin = await this.adminService.getById(userId);
            if (!admin) {
                throw new ForbiddenError('Access denied');
            }

            const userRole = admin.role_name;
            const isAllowed = allowedRoles.includes(userRole) //
                || (userRole === 'super-admin');

            if (!isAllowed) {
                throw new ForbiddenError('Access denied: insufficient permissions');
            }

            req.user.role = userRole;
            next();
        };
};


    requireAdmin = this.allowRole(['admin', 'response-admin', 'audit-admin', 'special-admin', 'super-admin']);
    requireResponseAdmin = this.allowRole(['response-admin', 'super-admin']);
    requireAuditAdmin = this.allowRole(['audit-admin', 'super-admin']);
    requireSpecialAdmin = this.allowRole(['special-admin', 'super-admin']);
    requireSuperAdmin = this.allowRole(['super-admin']);
}

export const authMiddleware = new AuthMiddleware();