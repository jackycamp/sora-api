import initMedia from '../../data/from-ap.json';
import userData from '../../data/user.json';
import db from './db';

import Media from '../entity/media';
import { User } from '../entity/user';

const seedMedia = async () => {
	const connection = await db.connectToDatabase();
	connection?.createQueryBuilder()
		.insert()
		.into(Media.Entity)
		.values(
			initMedia.map((media) => ({ ...media, type: media.content_type }))
		)
		.execute();
};

const seedUser = async () => {
	const connection = await db.connectToDatabase();
	connection?.createQueryBuilder()
		.insert()
		.into(User)
		.values(
			userData.map((user) => ({ ...user }))
		)
		.execute();
};

seedMedia();
seedUser();
