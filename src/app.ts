import express from 'express';

import db from './config/db';

import V1Router from './routes/v1';
import V2Router from './routes/v2';

// Before booting the app, we establish a connection with the database.
// By default, typeorm will use the connection settings in ormconfig.json
db.connectToDatabase();

// Booting the app
const app = express();

// The server must accept OPTIONS request otherwise preflight won't pass
// and the request will be denied usually showing a cors error.
app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
		return res.status(200).json({});
	}

	next();
});

// Standard express config
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (_, res) => {
	res.json({ message: 'sora-api' });
});

app.use('/v1', V1Router);
app.use('/v2', V2Router);

app.listen(3000, () => {
	console.log('sora api running on port 3000');
});
