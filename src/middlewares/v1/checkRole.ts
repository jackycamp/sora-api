import { Request, Response, NextFunction } from 'express';
import { getRepository } from 'typeorm';

import { User } from '../../entity/user';

export const checkRole = (acceptedRoles: Array<string>) => {
	return async (req: Request, res: Response, next: NextFunction) => {
		// Get user Id from previous middleware
		const id = res.locals.jwtPayload.userId;

		// Get user role from database
		const repository = getRepository(User);
		let user: User;
		try {
			user = await repository.findOneOrFail(id);

			// Check if user's role is in the list of accepted roles
			if (acceptedRoles.indexOf(user.role) > -1) {
				next();
			} else {
				// User does not have access
				res.status(401).send('Access Denied');
			}
		} catch (error) {
			// User does not have access
			res.status(401).send('Access Denied');
		}
	};
};
