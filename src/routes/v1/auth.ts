import { Router } from 'express';
import AuthController from '../../controllers/v1/auth';
import { checkToken } from '../../middlewares/v1/checkToken';

const router = Router();

router.post('/login', AuthController.login);
router.post('/changepassword', checkToken, AuthController.changePassword);
router.post('/register', AuthController.create);

export default router;
