import initMedia from '../../data/from-ap.json';
import db from './db';

import Media from '../entity/media';

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

seedMedia();
