"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./src/routes"));
const errorHandler_1 = __importDefault(require("./src/middleware/errorHandler/errorHandler"));
const cors_1 = require("./src/middleware/cors");
const errorTypes_1 = require("./src/middleware/errorHandler/errorTypes");
const startupService_1 = require("./src/services/startupService");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_1 = require("./src/config/swagger");
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await startupService_1.StartupService.initializeServices();
        const app = (0, express_1.default)();
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use(cors_1.corsMiddleware);
        app.use('/', routes_1.default);
        app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.swaggerSpecs));
        app.use((req, res, next) => {
            next(new errorTypes_1.NotFoundError(`Route ${req.originalUrl} not found`));
        });
        app.use(errorHandler_1.default);
        startupService_1.StartupService.setupProcessHandlers();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/health`);
            console.log(`Test DB connection: http://localhost:${PORT}/api/test-db`);
            console.log(`Swagger docs: http://localhost:${PORT}/api-docs`);
        });
    }
    catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map