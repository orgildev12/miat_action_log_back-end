import { Router, Request, Response } from 'express';
import { LocationGroupController } from '../controllers/LocationGroupController';

const router = Router();
const locationGroupController = new LocationGroupController();

router.get('/', async (req: Request, res: Response) => {
  await locationGroupController.getAll(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await locationGroupController.create(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await locationGroupController.getById(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await locationGroupController.update(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await locationGroupController.delete(req, res);
});

export default router;