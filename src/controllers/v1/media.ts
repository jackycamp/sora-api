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

// TODO: Implement status codes into responses

const create = async (req: Request, res: Response) => {
	const params = req.body;
	const resp = await Media.addSingle(params);
	res.json(resp);
};

const update = async (req: Request, res: Response) => {
	const id = req.params.id;
	const params = req.query;
	const resp = await Media.updateSingle(id, params);
	res.json(resp);
};

const destroy = async (req: Request, res: Response) => {
	const id = req.params.id;
	const resp = await Media.removeSingle(id);
	res.json(resp);
};

export default {
	index,
	show,
	create,
	update,
	destroy
};
