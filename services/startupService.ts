import { dbManager } from '../database';

export class StartupService {
  static async initializeServices(): Promise<void> {
    console.log('🚀 Starting MIAT Action Log Backend...');
    
    await dbManager.initialize();
    
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
    process.on('SIGINT', () => this.gracefulShutdown('SIGINT'));
    process.on('SIGTERM', () => this.gracefulShutdown('SIGTERM'));

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }
}
