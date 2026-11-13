import { Router } from 'express';
import {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getTaskStats,
  getDBeaverInfo
} from '../controllers/taskController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = Router();

// Public helper for DBeaver connection info
router.get('/dbeaver-info', getDBeaverInfo);

// Protected routes (require valid JWT token)
router.use(authenticateToken);

router.get('/', getTasks);
router.get('/stats', getTaskStats);
router.get('/:id', getTaskById);
router.post('/', createTask);
router.put('/:id', updateTask);
router.patch('/:id/status', updateTaskStatus);
router.delete('/:id', deleteTask);

export default router;
