import dotenv from 'dotenv';
import express from 'express';
import routes from './src/routes';
import errorHandler from './src/middleware/errorHandler/errorHandler';
import { corsMiddleware } from './src/middleware/cors';
import { NotFoundError } from './src/middleware/errorHandler/errorTypes';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer(): Promise<void> {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(corsMiddleware);

  app.use('/', routes);

  app.use((req, res, next) => {
    next(new NotFoundError(`Route ${req.originalUrl} not found`));
  });

  app.use(errorHandler);
      
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`Test DB connection: http://localhost:${PORT}/api/test-db`);
  });

}

startServer();