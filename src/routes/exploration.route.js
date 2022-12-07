import express from 'express';
import httpErrors from 'http-errors';

import explorationRepository from '../repositories/exploration.repository.js';
import ExplorateurRepository from '../repositories/explorateur.repository.js';

import { guardAuthorizationJWT } from '../middlewares/authorization.jwt.js';

const router = express.Router();

class ExplorationRoutes {
    constructor() {
        router.post('/', guardAuthorizationJWT, this.post);
    }

    async post(req, res, next) {
        try {
            console.log('avant');
            console.log(req.body);
            let unExplorateur = await ExplorateurRepository.retrieveByEmail(req.body.explorateur);
            req.body.explorateur = unExplorateur._id;
            console.log(req.body);
            let exploration = await explorationRepository.create(req.body);
            exploration = exploration.toObject({ getters: false, virtuals: true });
            exploration = explorationRepository.transform(exploration);
            res.status(201).json({ exploration });
        } catch (err) {
            return next(err);
        }
    }
}

new ExplorationRoutes();
export default router;
