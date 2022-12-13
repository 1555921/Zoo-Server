import express from 'express';
import httpErrors from 'http-errors';

import creatureRepository from '../repositories/creature.repository.js';
import ExplorateurRepository from '../repositories/explorateur.repository.js';
import Explorateur from '../models/explorateur.model.js'

import { guardAuthorizationJWT } from '../middlewares/authorization.jwt.js';
const router = express.Router();


class CreatureRoutes {
    constructor() {
        router.post('/', guardAuthorizationJWT,this.post);
    }


    async post(req, res, next) {
        try {
            let unExplorateur = await ExplorateurRepository.retrieveByEmail(req.body.explorateur);
            req.body.explorateur = unExplorateur._id;
            let creature = await creatureRepository.create(req.body);
            creature = creature.toObject();
            creature.kernel.forEach(kernelElement => {
                unExplorateur.elements.find(element => element.element == kernelElement).quantity --;
            });
            Explorateur.findByIdAndUpdate(unExplorateur.id, { elements: unExplorateur.elements }, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log('Updated User : ', docs);
                }
            });
            res.status(201).end();
        } catch (err) {
            return next(err);
        }
    }
}
new CreatureRoutes();
export default router;