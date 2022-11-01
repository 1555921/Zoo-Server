import express from 'express';
import httpErrors from 'http-errors';

import creatureRepository from '../repositories/creature.repository.js';


const router = express.Router();


class CreatureRoutes {
    constructor() {
        router.post('/',this.post);
    }


    async post(req, res, next) {
        try {
            let creature = await creatureRepository.create(req.body);
            creature = creature.toObject({ getter: false, virtuals: false });
            //creature = creatureRepository.transform(creature);
            res.status(201);
        } catch (err) {
            return next(err);
        }
    }
}
new CreatureRoutes();
export default router;