import { Router, Request, Response } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();
const healthController = new HealthController();

// Health check endpoint
router.get('/', async (req: Request, res: Response) => {
  await healthController.healthCheck(req, res);
});

export default router;
