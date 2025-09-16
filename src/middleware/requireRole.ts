import { AdminService } from "../services/adminService";
import { AuthError, ForbiddenError } from "./errorHandler/errorTypes";
import { Request, Response, NextFunction } from "express";

export class AuthMiddleware {
    private adminService = new AdminService();

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

