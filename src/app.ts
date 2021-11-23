import express from 'express';

import db from './config/db';

import V1Router from './routes/v1';
import V2Router from './routes/v2';

// Before booting the app, we establish a connection with the database.
// By default, typeorm will use the connection settings in ormconfig.json
db.connectToDatabase();

// Booting the app
const app = express();

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
