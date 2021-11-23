import { createConnection } from 'typeorm';

/**
 * Establishes a connection with the database using the configuration specified
 * in ormconfig.json. This connection should be treated as a connection pool rather
 * than a single connection in that this connection pool is used throughout the
 * applications entire life cycle.
 *
 * @returns {Promise<Connection>}
 */
const connectToDatabase = () => {
	try {
		console.log('Attempting to establish connection with database');
		const connection = createConnection();
		return connection;
	} catch (error) {
		console.log('Whoops, something went wrong connecting to the database', error);
	}
};

export default {
	connectToDatabase
};
