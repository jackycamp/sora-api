import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../../entity/user';

import config from '../../config/config';

const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	// Check if we were provided both a username and a password
	if (!(username && password)) {
		// Both were not supplied
		res.status(400).send();
	}

	// Get user from database
	const repository = getRepository(User);
	let user: User;
	try {
		user = await repository.findOneOrFail({ where: { username } });

		// Check if password matches
		if (!user.checkPassword(password)) {
			res.status(401).send();
			return;
		}

		// Login Successful! Create a fresh token and assign it to header
		const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

		// Send the new token as response
		res.send(token);
	} catch (error) {
		// User was not found or password did not match
		res.status(401).send();
	}
};

export default {
	login
};
