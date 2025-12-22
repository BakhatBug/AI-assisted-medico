import express, { Router } from 'express';
import { getProfile, updateProfile, saveDietPlan } from '../controllers/healthController';
import { protect } from '../middleware/authMiddleware';

const router: Router = express.Router();

router.get('/', protect, getProfile);
router.post('/', protect, updateProfile);
router.post('/save-plan', protect, saveDietPlan);

export default router;
