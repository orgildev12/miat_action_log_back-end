import dotenv from 'dotenv';
import { createApp } from './config/server';
import { StartupService } from './services/startupService';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3000;

// Main application startup
async function startServer(): Promise<void> {
  try {
    // Initialize all services (database, etc.)
    await StartupService.initializeServices();
    
    // Create and configure Express app
    const app = createApp();
    
    // Setup process handlers for graceful shutdown
    StartupService.setupProcessHandlers();
    
    // Start the server
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

// Start the application
startServer();