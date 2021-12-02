import express from 'express';
import Controller from '../../controllers/v1/media';
// import { checkToken } from 'middlewares/v1/checkToken';
// import { checkRole } from 'middlewares/v1/checkRole';

const router = express.Router();

router.get('/', Controller.index);
router.get('/:id', Controller.show);
router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.destroy);
// TODO: Implement role checking for media routes
// router.post('/', [checkToken, checkRole(['admin'])], Controller.create);
// router.put('/:id', [checkToken, checkRole(['admin'])], Controller.update);
// router.delete('/:id', [checkToken, checkRole(['admin'])], Controller.destroy);

export default router;
