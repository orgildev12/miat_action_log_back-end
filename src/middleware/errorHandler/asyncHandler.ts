import { Request, Response, NextFunction } from 'express';

// Generic async error handler wrapper
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

// Alternative syntax for class methods
export const asyncMethod = (target: any, propertyName: string, descriptor: PropertyDescriptor) => {
    const method = descriptor.value;
    
    descriptor.value = function(req: Request, res: Response, next: NextFunction) {
        Promise.resolve(method.call(this, req, res, next)).catch(next);
    };
    
    return descriptor;
};
