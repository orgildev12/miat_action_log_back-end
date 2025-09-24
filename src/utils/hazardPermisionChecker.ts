import { ForbiddenError } from '../middleware/errorHandler/errorTypes';
import { HazardService } from '../services/HazardService';
import { HazardTypeService } from '../services/HazardTypeService';
import { AdminService } from '../services/AdminService';
import { TaskOwnerService } from '../services/TaskOwnerService';
// Router дээр байгаа админ эрх шалгах фунццүүд нь зөвхөн тухайн админ эсвэл super-admin-д эрх өгдөг.
// Харин зарим тохиолдолд super-admin-тай нийлээд 3н админ хандах шаардлагатай болсон учраас
// тусдаа utility функц болгож гаргалаа.

export class HazardPermissionChecker {
    private hazardService = new HazardService();
    private hazardTypeService = new HazardTypeService();
    private adminService = new AdminService();
    private taskOwnerService = new TaskOwnerService();

    async checkPermissionForAccess(hazardId: number, req: any, whatRoleIsFor: number): Promise<any> {
        const adminRoleId = req.user?.role_id;
        const hazard = await this.hazardService.getById(hazardId, false, true, false);
        const hazardType = await this.hazardTypeService.getById(hazard.type_id);
        const isHazardPrivate = hazardType.isPrivate === 1;
        if ((adminRoleId === 5 && isHazardPrivate) || (adminRoleId === whatRoleIsFor && !isHazardPrivate) || adminRoleId === 6) {
            if (adminRoleId === 6) return isHazardPrivate;

            const admin = await this.adminService.getByUserId(req.user?.id);
            if (!admin.id) {
                throw new ForbiddenError('Access denied');
            }
            const isOwner = await this.taskOwnerService.checkOwner(hazardId, admin.id);
            if (!isOwner) {
                throw new ForbiddenError('Access denied');
            }

            return isHazardPrivate;
        } else {
            throw new ForbiddenError("You can't access to this hazard");
        }
    }
}