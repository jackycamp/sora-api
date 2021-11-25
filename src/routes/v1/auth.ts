import { Router } from 'express';
import AuthController from '../../controllers/v1/auth';

const router = Router();

router.post('/', AuthController.login);

export default router;
