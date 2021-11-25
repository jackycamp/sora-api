import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config/config';

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
	// Get jwt from the header
	const token = <string>req.headers.token;

	// Try to validate the token and store payload
	let jwtPayload;
	try {
		jwtPayload = <any>jwt.verify(token, config.jwtSecret);
		res.locals.jwtPayload = jwtPayload;
	} catch (error) {
		res.status(401).send('Access Denied');
		return;
	}

	// The token was valid and now make a new token that will be valid for 1 hour
	const { userId, username } = jwtPayload;
	const newToken = jwt.sign({ userId, username }, config.jwtSecret, { expiresIn: '1h' });

	// Set new token
	res.setHeader('token', newToken);

	// Call the next middleware
	next();
};
