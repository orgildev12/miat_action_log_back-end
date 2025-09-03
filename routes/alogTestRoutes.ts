import { Router, Request, Response } from 'express';
import { AlogTestController } from '../controllers/alogTestController';

const router = Router();
const alogTestController = new AlogTestController();

// Get all records from alog_test table
router.get('/', async (req: Request, res: Response) => {
  await alogTestController.getAllRecords(req, res);
});

// Create new record in alog_test table
router.post('/', async (req: Request, res: Response) => {
  await alogTestController.createRecord(req, res);
});

// Get record by ID from alog_test table
router.get('/:id', async (req: Request, res: Response) => {
  await alogTestController.getRecordById(req, res);
});

// Update record in alog_test table
router.put('/:id', async (req: Request, res: Response) => {
  await alogTestController.updateRecord(req, res);
});

// Delete record from alog_test table
router.delete('/:id', async (req: Request, res: Response) => {
  await alogTestController.deleteRecord(req, res);
});

export default router;
