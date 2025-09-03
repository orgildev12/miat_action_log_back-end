import { Router } from 'express';
import alogTestRoutes from './alogTestRoutes';
import healthRoutes from './healthRoutes';
import databaseRoutes from './databaseRoutes';

const router = Router();

// Mount routes
router.use('/health', healthRoutes);
router.use('/api/test-db', databaseRoutes);
router.use('/api/alog-test', alogTestRoutes);

export default router;
