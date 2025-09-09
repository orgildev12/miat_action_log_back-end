import { Router, Request, Response } from 'express';
import { HealthController } from '../controllers/healthController';

const router = Router();
const healthController = new HealthController();

/**
 * @openapi
 * /api/test-db:
 *   get:
 *     summary: Test database connection
 *     description: Attempts to connect to the database and returns the result.
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: Database connection successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Database connection successful
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Database connection failed or error occurred
 */
router.get('/', async (req: Request, res: Response) => {
  await healthController.databaseTest(req, res);
});

export default router;
