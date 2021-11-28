import { Entity, Column, PrimaryGeneratedColumn, Unique, getRepository } from 'typeorm';
import { Length, validate } from 'class-validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config';

@Entity()
@Unique(['username'])
class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	@Length(4, 20)
	username: string;

	@Column({ select: false })
	@Length(4, 100)
	password: string;

	@Column({ default: 'user' })
	role: string

	hashPassword () {
		this.password = bcrypt.hashSync(this.password, 8);
	}

	checkPassword (unencryptedPassword: string) {
		return bcrypt.compareSync(unencryptedPassword, this.password);
	}
}

const listAll = async () => {
	// Get all users from the user table
	const repository = getRepository(User);
	const users = await repository.find({ select: ['id', 'username', 'role'] });

	// Send users object
	return users;
};

const getById = async (id: string) => {
	// Try to find Id in user table
	const repository = getRepository(User);
	const data = await repository.findOne(id, { select: ['id', 'username', 'role'] });
	return data;
};

const modifyById = async (id: string, params: any) => {
	// Grab requested new values from body
	const { username, role } = params;

	// Try finding user in table
	const repository = getRepository(User);
	let user: User;
	try {
		user = await repository.findOneOrFail(id);
	} catch (error) {
		return error;
	}

	// Confirm new details meet requirements
	user.username = username;
	user.role = role;
	const errors = await validate(user, { skipMissingProperties: true });
	if (errors.length > 0) {
		return errors;
	}

	// Try saving updates. If it fails, new username is already taken
	try {
		await repository.save(user);
	} catch (e) {
		return 'Username is already taken';
	}

	// User has been successfully modified
	return user;
};

const deleteById = async (id: string) => {
	// Find user in table
	const repository = getRepository(User);
	let user: User;
	try {
		user = await repository.findOneOrFail(id);
	} catch (e) {
		return 'User not found';
	}

	// Successfully found user now delete them
	repository.delete(user);

	// User successfully deleted
	return user;
};

const create = async (params: any) => {
	// Get new user details from body
	const { username, password } = params;
	const newUser = new User();
	newUser.username = username;
	newUser.password = password;

	// Confirm new user details meet requirements
	const errors = await validate(newUser);
	if (errors.length > 0) {
		return errors;
	}

	// Hash new user's password
	newUser.hashPassword();

	// Get user table and try to save. If it fails, username is taken.
	const repository = getRepository(User);
	try {
		const user = await repository.save(newUser);
		return await repository.findOne(user.id);
	} catch (e) {
		return 'Username already taken';
	}
};

const login = async (params: any) => {
	const { username, password } = params;

	// Check if we were provided both a username and a password
	if (!(username && password)) {
		// Both were not supplied
		return 'Some fields are missing';
	}

	// Get user from database
	const repository = getRepository(User);
	let user: User;
	try {
		user = await repository.findOneOrFail({ select: ['password'], where: { username } });
	} catch (error) {
		return 'Incorrect username/password';
	}

	// Check if password matches
	if (!user.checkPassword(password)) {
		return 'Incorrect username/password';
	}

	// Login Successful! Create a fresh token
	const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

	// Send the new token as response
	return token;
};

const changePassword = async (id: string, params: any) => {
	const { oldPassword, newPassword } = params;

	// Check both parameters are present, if not bad request
	if (!(oldPassword && newPassword)) {
		return 'Must submit old password and new password';
	}

	// Get user table and find current user
	const repository = getRepository(User);
	let user: User;
	try {
		user = await repository.findOneOrFail(id, { select: ['id', 'username', 'password', 'role'] });
	} catch (id) {
		return 'User not found';
	}

	// Check if old password is correct
	if (!user.checkPassword(oldPassword)) {
		return 'Incorrect password';
	}

	// User has entered correct password. Confirm new password follows requirements.
	user.password = newPassword;
	const errors = await validate(user, { skipMissingProperties: true });
	if (errors.length > 0) {
		return errors;
	}

	// Hash the new password and save to table
	user.hashPassword();
	repository.save(user);
	return await repository.findOne(id);
};

export default {
	Entity: User,
	listAll,
	getById,
	modifyById,
	deleteById,
	create,
	login,
	changePassword
};
