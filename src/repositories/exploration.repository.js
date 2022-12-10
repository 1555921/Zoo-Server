import argon from 'argon2';
import Chance from 'chance';
import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';
import Explorateur from '../models/explorateur.model.js';

import Exploration from '../models/exploration.model.js';
import ExplorateurRepository from '../repositories/explorateur.repository.js';
import { ELEMENTS } from '../utils/constants.js';

//const chance = new Chance();

class ExplorationRepository {
    

   

    async create(exploration) {
        try {
            //unExplorateur = await ExplorateurRepository.retrieveByEmail(exploration.explorateur);
            //exploration.explorateur = unExplorateur.id;
            //console.log("password: " + explorateur.motDePasse);
            //explorateur.motDePasse = await argon.hash(explorateur.motDePasse);
            //delete explorateur.motDePasse;
            //explorateur.elements = ELEMENTS
            return Exploration.create(exploration);
        } catch (err) {
            throw err;
        }
    }

    
    transform(exploration) {
        //exploration.explorateur = ExplorateurRepository.retrieveByEmail(exploration.explorateur)._id;
        delete exploration._id;
        delete exploration.id;
        delete exploration.__v;
        console.log(exploration);
        return exploration;
    }
}

export default new ExplorationRepository();
