export class ValidationService {
  static validateName(name: any): { isValid: boolean; error?: string } {
    if (!name) {
      return { isValid: false, error: 'name is required' };
    }
    
    if (typeof name !== 'string') {
      return { isValid: false, error: 'name must be a string' };
    }
    
    if (name.trim().length === 0) {
      return { isValid: false, error: 'name cannot be empty' };
    }
    
    if (name.length > 255) {
      return { isValid: false, error: 'name cannot exceed 255 characters' };
    }
    
    return { isValid: true };
  }

  static validateId(id: any): { isValid: boolean; error?: string } {
    if (!id) {
      return { isValid: false, error: 'id is required' };
    }
    
    const numericId = parseInt(id);
    if (isNaN(numericId) || numericId <= 0) {
      return { isValid: false, error: 'id must be a positive number' };
    }
    
    return { isValid: true };
  }

  static validatePagination(limit?: string, offset?: string): { 
    isValid: boolean; 
    error?: string; 
    parsedLimit?: number; 
    parsedOffset?: number; 
  } {
    const parsedLimit = limit ? parseInt(limit) : 50;
    const parsedOffset = offset ? parseInt(offset) : 0;
    
    if (isNaN(parsedLimit) || parsedLimit <= 0 || parsedLimit > 1000) {
      return { isValid: false, error: 'limit must be between 1 and 1000' };
    }
    
    if (isNaN(parsedOffset) || parsedOffset < 0) {
      return { isValid: false, error: 'offset must be 0 or greater' };
    }
    
    return { isValid: true, parsedLimit, parsedOffset };
  }
}
