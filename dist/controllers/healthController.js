"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HealthController = void 0;
const database_1 = require("../database");
class HealthController {
    async healthCheck(req, res) {
        res.json({
            status: 'OK',
            timestamp: new Date().toISOString(),
            uptime: process.uptime()
        });
    }
    async databaseTest(req, res) {
        try {
            const isConnected = await database_1.dbManager.testConnection();
            if (isConnected) {
                res.json({
                    success: true,
                    message: 'Database connection successful',
                    timestamp: new Date().toISOString()
                });
            }
            else {
                res.status(500).json({
                    success: false,
                    message: 'Database connection failed'
                });
            }
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Database connection error',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
}
exports.HealthController = HealthController;
//# sourceMappingURL=healthController.js.map