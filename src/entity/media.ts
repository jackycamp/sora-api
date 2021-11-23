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

	const { title, year, type, titleLike } = params;

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
		]
	});
	return data;
};

const findSingle = async (id: number | string) => {
	const connection = getConnection();
	const repository = connection.getRepository(Media);
	const data = await repository.createQueryBuilder('media').where('media.id = :id', { id: id }).getOne();
	return data;
};

export default {
	Entity: Media,
	findMany,
	findSingle
};
