import cors from 'cors';
import express from 'express';

import errors from './middlewares/errors.js';
import database from './libs/database.js';

import explorateurRoutes from './routes/explorateur.routes.js';
import creatureRoutes from './routes/creature.route.js';
import Creature from './models/creature.model.js';

const app = express();
database();

app.use(cors());
app.use(express.json());

app.get('/status', (req, res) => { res.status(200).end(); });
app.head('/status', (req, res) => { res.status(200).end(); });

app.use('/explorateurs', explorateurRoutes);
app.use('/creatures',creatureRoutes);

app.use(errors);

export default app;