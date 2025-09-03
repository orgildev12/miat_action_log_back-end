export class ValidationService {
  static validateName(name: any): { isValid: boolean; error?: string } {
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return { isValid: false, error: 'name is required' };
    }
    if (name.length > 255) {
      return { isValid: false, error: 'name cannot exceed 255 characters' };
    }
    return { isValid: true };
  }

  static validateId(id: any): { isValid: boolean; error?: string } {
    const numericId = parseInt(id);
    if (isNaN(numericId) || numericId <= 0) {
      return { isValid: false, error: 'id must be a positive number' };
    }
    return { isValid: true };
  }
}
