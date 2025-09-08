import { Router } from 'express';
import healthRoutes from './healthRoutes';
import databaseRoutes from './databaseRoutes';
import hazardRoutes from './hazard';
import locationGroupRoutes from './locationGroup';

const router = Router();

router.use('/health', healthRoutes);
router.use('/api/test-db', databaseRoutes);
router.use('/api/hazards', hazardRoutes);
router.use('/api/locationGroup', locationGroupRoutes);

export default router;
