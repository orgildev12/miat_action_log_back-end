import { Router, Request, Response } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();
const healthController = new HealthController();

/**
 * @openapi
 * /health:
 *   get:
 *     summary: Health check
 *     description: Returns service health status and uptime.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: OK
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 uptime:
 *                   type: number
 */
router.get('/', async (req: Request, res: Response) => {
  await healthController.healthCheck(req, res);
});

export default router;
