import { Request, Response } from 'express';
import { dbManager } from '../../database';

export class HealthController {
  async healthCheck(req: Request, res: Response): Promise<void> {
    res.json({
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    });
  }

  async databaseTest(req: Request, res: Response): Promise<void> {
    try {
      const isConnected = await dbManager.testConnection();
      if (isConnected) {
        res.json({
          success: true,
          message: 'Database connection successful',
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Database connection failed'
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Database connection error',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
