import { Router, Request, Response } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();
const healthController = new HealthController();

router.get('/', async (req: Request, res: Response) => {
  await healthController.databaseTest(req, res);
});

export default router;
