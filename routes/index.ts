import { Router } from 'express';
import hazardRoutes from './hazardRoutes';
import healthRoutes from './healthRoutes';
import databaseRoutes from './databaseRoutes';
import locationGroupRoutes from './locationGroupRoute';
const router = Router();

router.use('/health', healthRoutes);
router.use('/api/test-db', databaseRoutes);
router.use('/api/hazards', hazardRoutes);
router.use('/api/locationGroup', locationGroupRoutes);

export default router;
