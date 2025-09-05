import { Router } from 'express';
import alogTestRoutes from './alogTestRoutes';
import hazardRoutes from './hazardRoutes';
import healthRoutes from './healthRoutes';
import databaseRoutes from './databaseRoutes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/test-db', databaseRoutes);
router.use('/api/alog-test', alogTestRoutes);
router.use('/api/hazards', hazardRoutes);

export default router;
