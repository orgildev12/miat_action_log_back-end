"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenericError = exports.ConflictError = exports.ForbiddenError = exports.NotFoundError = exports.ValidationError = void 0;
class ValidationError extends Error {
    constructor(errors) {
        const errorArray = Array.isArray(errors) ? errors : [errors];
        const message = `Validation failed: ${errorArray.join(', ')}`;
        super(message);
        this.status = 400;
        this.name = 'ValidationError';
        this.message = message;
        this.errors = errorArray;
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends Error {
    constructor(message) {
        super(message);
        this.status = 404;
        this.name = 'NotFoundError';
        this.message = message;
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends Error {
    constructor(message = 'Access denied') {
        super(message);
        this.status = 403;
        this.name = 'ForbiddenError';
        this.message = message;
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends Error {
    constructor(resource, field) {
        const message = field
            ? `${resource} with this ${field} already exists`
            : `${resource} already exists`;
        super(message);
        this.status = 409;
        this.name = 'ConflictError';
        this.message = message;
    }
}
exports.ConflictError = ConflictError;
class GenericError extends Error {
    constructor(message = 'An error occurred', status = 500) {
        super(message);
        this.name = 'GenericError';
        this.message = message;
        this.status = status;
    }
}
exports.GenericError = GenericError;
//# sourceMappingURL=errors.js.map