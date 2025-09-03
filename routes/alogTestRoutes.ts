import { Router, Request, Response } from 'express';
import { AlogTestController } from '../controllers/alogTestController';

const router = Router();
const alogTestController = new AlogTestController();

router.get('/', async (req: Request, res: Response) => {
  await alogTestController.getAllRecords(req, res);
});

router.post('/', async (req: Request, res: Response) => {
  await alogTestController.createRecord(req, res);
});

router.get('/:id', async (req: Request, res: Response) => {
  await alogTestController.getRecordById(req, res);
});

router.put('/:id', async (req: Request, res: Response) => {
  await alogTestController.updateRecord(req, res);
});

router.delete('/:id', async (req: Request, res: Response) => {
  await alogTestController.deleteRecord(req, res);
});

export default router;
