import { Request, Response } from 'express';
import User from '../../entity/user';

const login = async (req: Request, res: Response) => {
	const data = await User.login(req.body);
	res.send(data);
};

const changePassword = async (req: Request, res: Response) => {
	// Get user Id from token
	const id = res.locals.jwtPayload.userId;
	const data = await User.changePassword(id, req.body);
	res.json(data);
};

const create = async (req: Request, res: Response) => {
	const data = await User.create(req.body);
	res.json(data);
};

export default {
	login,
	changePassword,
	create
};
