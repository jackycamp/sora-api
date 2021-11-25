import { Request, Response } from 'express';
import { User } from '../../entity/user';
import { getRepository } from 'typeorm';

const listAll = async (req: Request, res: Response) => {
	// Get all users from the user table
	const repository = getRepository(User);
	const users = await repository.find({ select: ['id', 'username', 'role'] });

	// Send users object
	res.send(users);
};

const getUserById = async (req: Request, res: Response) => {
	// Get Id from URL
	const id: string | number = req.params.id;

	// Try to find Id in user table
	const repository = getRepository(User);
	try {
		const user = await repository.findOneOrFail(id);
		res.send(user);
	} catch (error) {
		// User was not found
		res.status(404).send('User not found');
	}
};

export default {
	listAll,
	getUserById
};
