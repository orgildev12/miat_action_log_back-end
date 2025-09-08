"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.corsMiddleware = void 0;
const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
exports.corsMiddleware = corsMiddleware;
const errorHandler = (err, req, res, next) => {
    console.error('Error occurred:', err);
    if (err.status && err.name) {
        const response = {
            name: err.name,
            message: err.message
        };
        if (err.name === 'ValidationError' && err.errors) {
            response.errors = err.errors;
        }
        if (process.env.NODE_ENV === 'development') {
            response.stack = err.stack;
        }
        res.status(err.status).json(response);
        return;
    }
    res.status(500).json({
        name: 'InternalServerError',
        message: 'Internal server error',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=index.js.map