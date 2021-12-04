import { Entity, Column, PrimaryGeneratedColumn, getConnection, Like } from 'typeorm';
import { IsIn, Min, validate } from 'class-validator';
import { raw } from 'express';

@Entity()
class Media {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
	@IsIn(['Movie', 'TV', 'Web', 'OVA', 'DVD Special', 'Music Video', 'Other', 'Anime', 'Manga'])
    type: string;

    @Column()
	@Min(1900)
    year: number;
};

// Used to validate new or updated media objects
const validateMedia = async (title: string, year: string, type: string) => {
	let invalid = false;
	const temp = new Media();
	temp.title = title;
	temp.year = parseInt(year);
	temp.type = type;
	const errors = await validate(temp);
	if (errors.length > 0) {
		invalid = true;
	}
	return invalid;
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

const addSingle = async (params: any) => {
	try {
		const connection = getConnection();
		const repository = connection.getRepository(Media);
		const { title, year, type } = params;
		// Media validation
		if (await validateMedia(title, year, type)) {
			throw new Error('Invalid parameters');
		}
		const insert = await connection.createQueryBuilder()
			.insert()
			.into('media')
			.values({
				title: title, year: year, type: type
			})
			.execute();

		const data = await repository.createQueryBuilder('media').where('media.id = :id', { id: insert.raw.insertId }).getOne();
		const resp = {
			message: 'Entry created',
			data: data
		};
		return resp;
	} catch (e) {
		const resp = {
			message: 'Failed to add entry',
			error: (e as Error).message
		};
		return resp;
	}
};

const updateSingle = async (id: number | string, params: any) => {
	try {
		const connection = getConnection();
		const repository = connection.getRepository(Media);
		const { title, year, type } = params;
		let data = await repository.createQueryBuilder('media').where('media.id = :id', { id: id }).getOne();
		// Id validation
		if (!data) {
			throw new Error('Entry does not exist');
		}
		// Media validation
		if (await validateMedia(title, year, type)) {
			throw new Error('Invalid parameters');
		}
		await connection.createQueryBuilder()
			.update('media')
			.set({
				...(title && { title: title }),
				...(year && { year: year }),
				...(type && { type: type })
			}).where('media.id = :id', { id: id })
			.execute();
		data = await repository.createQueryBuilder('media').where('media.id = :id', { id: id }).getOne();
		const resp = {
			message: 'Entry updated',
			data: data
		};
		return resp;
	} catch (e) {
		const resp = {
			message: 'Entry failed to update',
			error: (e as Error).message
		};
		return resp;
	}
};

const removeSingle = async (id: number | string) => {
	try {
		const connection = getConnection();
		const repository = connection.getRepository(Media);
		const data = await repository.createQueryBuilder('media').where('media.id = :id', { id: id }).getOne();
		// Id Validation
		if (!data) {
			throw new Error('Entry does not exist');
		}
		await connection.createQueryBuilder()
			.delete()
			.from('media')
			.where('media.id = :id', { id: id })
			.execute();
		const resp = {
			message: 'Entry deleted',
			data: data
		};
		return resp;
	} catch (e) {
		const resp = {
			message: 'Entry failed to delete',
			error: (e as Error).message
		};
		return resp;
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
