import express from 'express';

const router = express.Router();

router.get('/', (_, res) => {
	res.json({ message: 'sora-api version 2.0' });
});

export default router;
