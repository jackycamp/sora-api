import { Request, Response } from 'express';
import Media from '../../entity/media';

const index = async (req: Request, res: Response) => {
	const params = req.query;
	const data = await Media.findMany(params);
	res.json(data);
};

const show = async (req: Request, res: Response) => {
	const id = req.params.id;
	const data = await Media.findSingle(id);
	res.json(data);
};

// Preventing ability to create, update, and destroy for now.

// const create = async (req: Request, res: Response) => {
// 	const connection = getConnection();
// 	const repository = connection.getRepository(Media);
// 	const data = await repository.find();
// 	res.json(data);
// };

// const update = async (req: Request, res: Response) => {
// 	const connection = getConnection();
// 	const repository = connection.getRepository(Media);
// 	const data = await repository.find();
// 	res.json(data);
// };

// const destroy = async (req: Request, res: Response) => {
// 	const connection = getConnection();
// 	const repository = connection.getRepository(Media);
// 	const data = await repository.find();
// 	res.json(data);
// };

export default {
	index,
	show,
	// create,
	// update,
	// destroy
};
