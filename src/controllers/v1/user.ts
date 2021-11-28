import { Request, Response } from 'express';
import User from '../../entity/user';

const index = async (req: Request, res: Response) => {
	const users = await User.listAll();
	res.json(users);
};

const show = async (req: Request, res: Response) => {
	const id: string | number = req.params.id;
	const data = await User.getById(id);
	res.json(data);
};

const update = async (req: Request, res: Response) => {
	const data = await User.modifyById(req.params.id, req.body);
	res.json(data);
};

const destroy = async (req: Request, res: Response) => {
	const data = await User.deleteById(req.params.id);
	res.json(data);
};

export default {
	index,
	show,
	update,
	destroy
};
