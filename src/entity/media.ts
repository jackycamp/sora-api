import { Entity, Column, PrimaryGeneratedColumn, getConnection, Like } from 'typeorm';

@Entity()
class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    type: string;

    @Column()
    year: number;
};

// Note, you may notice the getConnection() happening inside of the body of the
// controller actions. At first glance, you may think that this is establishing a new
// connection to the database.

// However, this is actually using the existing connection established
// at the beginning of the application's lifecycle.

const findMany = async (params: any) => {
	const connection = getConnection();
	const repository = connection.getRepository(Media);

	const { title, year, type, titleLike, limit } = params;

	// Conditionally adding parameters to the query
	// allows for more flexible querying.

	const data = await repository.find({
		where: [
			{
				...(title && { title: title }),
				...(titleLike && { title: Like(`%${titleLike}%`) }),
				...(year && { year: year }),
				...(type && { type: type }),
			}
		],
		take: limit || 100
	});
	return data;
};

const findSingle = async (id: number | string) => {
	const connection = getConnection();
	const repository = connection.getRepository(Media);
	const data = await repository.createQueryBuilder('media').where('media.id = :id', { id: id }).getOne();
	return data;
};

// TODO: Perform validation on title and year
const addSingle = async (params: any) => {
	try {
		const connection = getConnection();
		const { title, year, type } = params;
		// Input validation for the type
		if (type !== 'Movie' && type !== 'TV' && type !== 'Web' && type !== 'OVA' && type !== 'DVD Special' && type !== 'Music Video' && type !== 'Other') {
			throw new Error('Invalid type');
		}
		if (parseInt(year) < 1900) {
			throw new Error('Invalid year');
		}
		await connection.createQueryBuilder()
			.insert()
			.into('media')
			.values({
				title: title, year: year, type: type
			})
			.execute();
		return 'Entry added';
	} catch (error) {
		return 'Invalid parameters, failed to add entry';
	}
};

const updateSingle = async (id: number | string, params: any) => {
	try {
		const connection = getConnection();
		const { title, year, type } = params;
		// Checks if the user provided a data type before changing it.
		// This allows for changing one column without having to write to other columns
		if (title) {
			await connection.createQueryBuilder()
				.update('media')
				.set({
					title: title
				}).where('media.id = :id', { id: id })
				.execute();
		}
		if (year) {
			if (parseInt(year) < 1900) {
				throw new Error('Invalid year');
			}
			await connection.createQueryBuilder()
				.update('media')
				.set({
					year: year
				}).where('media.id = :id', { id: id })
				.execute();
		}
		if (type) {
			// Input validation for the type
			if (type !== 'Movie' && type !== 'TV' && type !== 'Web' && type !== 'OVA' && type !== 'DVD Special' && type !== 'Music Video' && type !== 'Other') {
				throw new Error('Invalid type');
			}
			await connection.createQueryBuilder()
				.update('media')
				.set({
					type: type
				}).where('media.id = :id', { id: id })
				.execute();
		}
		return 'Entry updated';
	} catch (error) {
		return 'Entry failed to update';
	}
};

const removeSingle = async (id: number | string) => {
	try {
		const connection = getConnection();
		await connection.createQueryBuilder()
			.delete()
			.from('media')
			.where('media.id = :id', { id: id })
			.execute();
		return 'Entry deleted';
	} catch (error) {
		return 'Entry failed to delete';
	}
};

export default {
	Entity: Media,
	findMany,
	findSingle,
	addSingle,
	updateSingle,
	removeSingle
};
