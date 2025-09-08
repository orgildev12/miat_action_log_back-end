"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StartupService = void 0;
const database_1 = require("../database");
class StartupService {
    static async initializeServices() {
        console.log('🚀 Starting MIAT Action Log Backend...');
        await database_1.dbManager.initialize();
        const isConnected = await database_1.dbManager.testConnection();
        if (!isConnected) {
            throw new Error('Database connection test failed');
        }
        console.log('✅ All services initialized successfully');
    }
    static async gracefulShutdown(signal) {
        console.log(`\n${signal} received. Shutting down gracefully...`);
        try {
            await database_1.dbManager.close();
            console.log('✅ Database connections closed');
            process.exit(0);
        }
        catch (error) {
            console.error('❌ Error during shutdown:', error);
            process.exit(1);
        }
    }
    static setupProcessHandlers() {
        process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
        process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));
        process.on('unhandledRejection', (reason, promise) => {
            console.error('Unhandled Rejection at:', promise, 'reason:', reason);
            process.exit(1);
        });
    }
}
exports.StartupService = StartupService;
//# sourceMappingURL=startupService.js.map