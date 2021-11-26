import express from 'express';
import UserController from '../../controllers/v1/user';
import { checkToken } from '../../middlewares/v1/checkToken';
import { checkRole } from '../../middlewares/v1/checkRole';

const router = express.Router();

router.get('/', [checkToken, checkRole(['superadmin', 'admin'])], UserController.listAll);
router.get('/:id', [checkToken, checkRole(['superadmin', 'admin'])], UserController.getUserById);

router.post('/:id', [checkToken, checkRole(['superadmin'])], UserController.modifyUser);
router.delete('/:id', [checkToken, checkRole(['superadmin'])], UserController.deleteUser);

export default router;
