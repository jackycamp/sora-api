import express from 'express';
import Controller from '../../controllers/v1/media';

const router = express.Router();

router.get('/', Controller.index);
router.get('/:id', Controller.show);
router.post('/', Controller.create);
router.put('/:id', Controller.update);
router.delete('/:id', Controller.destroy);

export default router;
