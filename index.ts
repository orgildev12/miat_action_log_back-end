import dotenv from 'dotenv';
import { createApp } from './config/server';
import { StartupService } from './services/startupService';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  try {
    await StartupService.initializeServices();
    
    const app = createApp();
    
    StartupService.setupProcessHandlers();
    
    app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 Test DB connection: http://localhost:${PORT}/api/test-db`);
      console.log(`📝 Alog Test API: http://localhost:${PORT}/api/alog-test`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();