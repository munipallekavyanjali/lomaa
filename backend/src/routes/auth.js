import { Router } from 'express';
import { register, login, getMe, getDemoCredentials, googleLogin } from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', authenticateToken, getMe);
router.get('/demo', getDemoCredentials);
router.post('/google', googleLogin);

export default router;
