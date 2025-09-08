"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const server_1 = require("./config/server");
const startupService_1 = require("./services/startupService");
dotenv_1.default.config();
const PORT = process.env.PORT || 3000;
async function startServer() {
    try {
        await startupService_1.StartupService.initializeServices();
        const app = (0, server_1.createApp)();
        startupService_1.StartupService.setupProcessHandlers();
        app.listen(PORT, () => {
            console.log(`✅ Server is running on port ${PORT}`);
            console.log(`📊 Health check: http://localhost:${PORT}/health`);
            console.log(`🔌 Test DB connection: http://localhost:${PORT}/api/test-db`);
            console.log(`📝 Alog Test API: http://localhost:${PORT}/api/alog-test`);
        });
    }
    catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
//# sourceMappingURL=index.js.map