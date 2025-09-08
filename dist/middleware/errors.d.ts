export declare class ValidationError extends Error {
    status: number;
    name: string;
    message: string;
    errors: string[];
    constructor(errors: string[] | string);
}
export declare class NotFoundError extends Error {
    status: number;
    name: string;
    message: string;
    constructor(message: string);
}
export declare class ForbiddenError extends Error {
    status: number;
    name: string;
    message: string;
    constructor(message?: string);
}
export declare class ConflictError extends Error {
    status: number;
    name: string;
    message: string;
    constructor(resource: string, field?: string);
}
export declare class GenericError extends Error {
    status: number;
    name: string;
    message: string;
    constructor(message?: string, status?: number);
}
//# sourceMappingURL=errors.d.ts.map