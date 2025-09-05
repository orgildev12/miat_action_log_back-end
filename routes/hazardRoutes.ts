import { Router, Request, Response } from 'express';
import { HazardController } from '../controllers/hazardController';

const router = Router();
const hazardController = new HazardController();

router.get('/', async (req: Request, res: Response) => {
  await hazardController.getAll(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await hazardController.create(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await hazardController.getById(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await hazardController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await hazardController.delete(req, res);
});

export default router;