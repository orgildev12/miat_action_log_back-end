"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const routes_1 = __importDefault(require("../routes"));
function createApp() {
    const app = (0, express_1.default)();
    app.use(express_1.default.json());
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use(middleware_1.corsMiddleware);
    app.use('/', routes_1.default);
    app.use((req, res, next) => {
        res.status(404).json({
            success: false,
            message: 'Route not found'
        });
    });
    app.use(middleware_1.errorHandler);
    return app;
}
//# sourceMappingURL=server.js.map