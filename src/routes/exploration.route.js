import express from 'express';
import httpErrors from 'http-errors';

import explorationRepository from '../repositories/exploration.repository.js';
import ExplorateurRepository from '../repositories/explorateur.repository.js';
import Explorateur from '../models/explorateur.model.js'

import { guardAuthorizationJWT } from '../middlewares/authorization.jwt.js';

const router = express.Router();

class ExplorationRoutes {
    constructor() {
        router.post('/', guardAuthorizationJWT, this.post);
    }

    async post(req, res, next) {
        try {
           
            
            let unExplorateur = await ExplorateurRepository.retrieveByEmail(req.body.explorateur);
            req.body.explorateur = unExplorateur._id;
           
            let exploration = await explorationRepository.create(req.body);
            exploration = exploration.toObject({ getters: false, virtuals: true });
            exploration = explorationRepository.transform(exploration);
            if(exploration.vault.elements.length > 0)
            {
                exploration.vault.elements.forEach(vaultElement => {
                    unExplorateur.elements.find(element => element.element == vaultElement.element).quantity += vaultElement.quantity;
                });
                    
            }
            unExplorateur.inox += exploration.vault.inox;
            Explorateur.findByIdAndUpdate(unExplorateur.id, { elements: unExplorateur.elements, inox: unExplorateur.inox }, function (err, docs) {
                if (err) {
                    console.log(err);
                } else {
                    //console.log('Updated User : ', docs);
                }
            });
            res.status(201).json({ exploration });
        } catch (err) {
            return next(err);
        }
    }
}

new ExplorationRoutes();
export default router;
