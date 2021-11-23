import express from 'express';
import MediaRouter from './media';

const router = express.Router();

router.get('/', (_, res) => {
	res.json({ message: 'sora-api version 1.0' });
});

router.use('/media', MediaRouter);

export default router;
