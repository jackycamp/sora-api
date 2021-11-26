import { Request, Response } from 'express';
import { User } from '../../entity/user';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';

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
		const user = await repository.findOneOrFail(id, { select: ['id', 'username', 'role'] });
		res.send(user);
	} catch (error) {
		// User was not found
		res.status(404).send('User not found');
	}
};

const createUser = async (req: Request, res: Response) => {
	// Get new user details from body
	const { username, password } = req.body;
	const newUser = new User();
	newUser.username = username;
	newUser.password = password;

	// Confirm new user details meet requirements
	const errors = await validate(newUser);
	if (errors.length > 0) {
		res.status(400).send(errors);
		return;
	}

	// Hash new user's password
	newUser.hashPassword();

	// Get user table and try to save. If it fails, username is taken.
	const repository = getRepository(User);
	try {
		await repository.save(newUser);
	} catch (e) {
		res.status(409).send('Username already taken');
		return;
	}

	// User has successfully been created if we reach here
	res.status(201).send('User successfully created');
};

const modifyUser = async (req: Request, res: Response) => {
	// Grab user to edit from URL
	const userId = req.params.id;

	// Grab requested new values from body
	const { username, role } = req.body;

	// Try finding user in table
	const repository = getRepository(User);
	let user: User;
	try {
		user = await repository.findOneOrFail(userId);
	} catch (error) {
		res.status(404).send('User not found');
		return;
	}

	// Confirm new details meet requirements
	user.username = username;
	user.role = role;
	const errors = await validate(user);
	if (errors.length > 0) {
		res.status(400).send(errors);
		return;
	}

	// Try saving updates. If it fails, new username is already taken
	try {
		await repository.save(user);
	} catch (e) {
		res.status(409).send('Username is already taken');
		return;
	}

	// User has been successfully modified
	res.status(200).send('User succesfully modified');
};

const deleteUser = async (req: Request, res: Response) => {
	// Get user to delete from URL
	const userId = req.params.id;

	// Find user in table
	const repository = getRepository(User);
	let user: User;
	try {
		user = await repository.findOneOrFail(userId);
	} catch (e) {
		res.status(404).send('User not found');
		return;
	}

	// Successfully found user not delete them
	repository.delete(user);

	// User successfully deleted
	res.status(200).send('User has been deleted');
};

export default {
	listAll,
	getUserById,
	createUser,
	modifyUser,
	deleteUser
};
