import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { User } from '../../entity/user';
import config from '../../config/config';
import { validate } from 'class-validator';

const login = async (req: Request, res: Response) => {
	const { username, password } = req.body;

	// Check if we were provided both a username and a password
	if (!(username && password)) {
		// Both were not supplied
		res.status(400).send();
		return;
	}

	// Get user from database
	const repository = getRepository(User);
	let user: User;
	try {
		user = await repository.findOneOrFail({ where: { username } });
	} catch (error) {
		// User was not found or password did not match
		res.status(401).send();
		return;
	}

	// Check if password matches
	if (!user.checkPassword(password)) {
		res.status(401).send();
		return;
	}

	// Login Successful! Create a fresh token
	const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

	// Send the new token as response
	res.send(token);
};

const changePassword = async (req: Request, res: Response) => {
	// Get user Id from token
	const id = res.locals.jwtPayload.userId;

	// Get old and new password from body
	const { oldPassword, newPassword } = req.body;

	// Check both parameters are present, if not bad request
	if (!(oldPassword && newPassword)) {
		res.status(400).send('Must submit old password and new password');
		return;
	}

	// Get user table and find current user
	const repository = getRepository(User);
	let user: User;
	try {
		user = await repository.findOneOrFail(id);
	} catch (id) {
		res.status(401).send('401 Unauthorized');
		return;
	}

	// Check if old password is correct
	if (!user.checkPassword(oldPassword)) {
		res.status(401).send('Incorrect password');
	}

	// User has entered correct password. Confirm new password follows requirements.
	user.password = newPassword;
	const errors = await validate(user);
	if (errors.length > 0) {
		res.status(400).send(errors);
		return;
	}

	// Hash the new password and save to table
	user.hashPassword();
	repository.save(user);

	res.status(200).send('Successfully changed password');
};

export default {
	login,
	changePassword
};
