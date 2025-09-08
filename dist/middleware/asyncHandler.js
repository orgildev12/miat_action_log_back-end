"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.asyncMethod = exports.asyncHandler = void 0;
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
const asyncMethod = (target, propertyName, descriptor) => {
    const method = descriptor.value;
    descriptor.value = function (req, res, next) {
        Promise.resolve(method.call(this, req, res, next)).catch(next);
    };
    return descriptor;
};
exports.asyncMethod = asyncMethod;
//# sourceMappingURL=asyncHandler.js.map