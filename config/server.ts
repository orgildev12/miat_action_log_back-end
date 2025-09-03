import express from 'express';
import { corsMiddleware, errorHandler } from '../middleware';
import routes from '../routes';

export function createApp(): express.Application {
  const app = express();

  // Basic middleware
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  
  // CORS middleware
  app.use(corsMiddleware);

  // Routes
  app.use('/', routes);

  // 404 handler for unmatched routes
  app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
    res.status(404).json({
      success: false,
      message: 'Route not found'
    });
  });

  // Error handling middleware (must be after 404 handler)
  app.use(errorHandler);

  return app;
}
