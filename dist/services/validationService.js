"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
class ValidationService {
    static validateName(name) {
        if (!name || typeof name !== 'string' || name.trim().length === 0) {
            return { isValid: false, error: 'name is required' };
        }
        if (name.length > 255) {
            return { isValid: false, error: 'name cannot exceed 255 characters' };
        }
        return { isValid: true };
    }
    static validateId(id) {
        const numericId = parseInt(id);
        if (isNaN(numericId) || numericId <= 0) {
            return { isValid: false, error: 'id must be a positive number' };
        }
        return { isValid: true };
    }
}
exports.ValidationService = ValidationService;
//# sourceMappingURL=validationService.js.map