import { dbManager } from '../database';

export class StartupService {
  static async initializeServices(): Promise<void> {
    console.log('🚀 Starting MIAT Action Log Backend...');
    
    // Initialize database connection
    await dbManager.initialize();
    
    // Test database connection
    const isConnected = await dbManager.testConnection();
    if (!isConnected) {
      throw new Error('Database connection test failed');
    }
    
    console.log('✅ All services initialized successfully');
  }

  static async gracefulShutdown(signal: string): Promise<void> {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    try {
      await dbManager.close();
      console.log('✅ Database connections closed');
      process.exit(0);
    } catch (error) {
      console.error('❌ Error during shutdown:', error);
      process.exit(1);
    }
  }

  static setupProcessHandlers(): void {
    // Graceful shutdown handlers
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }
}
