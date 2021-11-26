import express from 'express';
import MediaRouter from './media';
import UserRouter from './user';
import AuthRouter from './auth';

const router = express.Router();

router.get('/', (_, res) => {
	res.json({ message: 'sora-api version 1.0' });
});

router.use('/media', MediaRouter);
router.use('/user', UserRouter);
router.use('/auth', AuthRouter);

export default router;
