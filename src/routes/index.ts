import { Router } from 'express';
import healthRoutes from './healthRoutes';
import databaseRoutes from './databaseRoutes';
import hazardRoutes from './hazard';
import locationGroupRoutes from './locationGroup';
import locationRoutes from './location/locationRoutes';
import hazardTypeRoutes from './hazardType';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome, http://localhost:3000/api-docs for API documentation'
  });
});

router.use('/health', healthRoutes);
router.use('/api/test-db', databaseRoutes);
router.use('/api/hazard', hazardRoutes);
router.use('/api/locationGroup', locationGroupRoutes);
router.use('/api/locations', locationRoutes);
router.use('/api/hazardType', hazardTypeRoutes);

export default router;
