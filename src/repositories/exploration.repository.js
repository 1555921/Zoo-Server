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
    /*retrieveByEmail(courriel) {
        return Explorateur.findOne({ courriel: courriel }).populate('creatures');
    }*/

    /*retrieveAll() {
        return Explorateur.find().populate('creatures');
    }*/

    /*async login(courriel, motDePasse) {
        const explorateur = await Explorateur.findOne({ courriel: courriel }).populate('creatures');
        console.log("help me " + courriel);
        if (!explorateur) {
            console.log("how");
            return { err: HttpErrors.Unauthorized() };
        } else {
            console.log("ok this is pog: " + explorateur.motDePasse + " " + motDePasse);
            const motDePasseValide = await argon.verify(explorateur.motDePasse, motDePasse);
            if (motDePasseValide) {
                return { explorateur };
            } else {
                return { err: HttpErrors.Unauthorized() };
            }
        }
    }*/

    //validatePassword(motDePasse, explorateur) {}

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

    /*generateJWT(email, id) {
        const accessToken = jwt.sign({ email }, process.env.JWT_TOKEN_SECRET, {
            expiresIn: process.env.JWT_TOKEN_LIFE,
            issuer: process.env.BASE_URL
        });
        const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_LIFE,
            issuer: process.env.BASE_URL
        });

        return { accessToken, refreshToken };
    }*/

    //async validateRefreshToken(email, refreshToken) {}

    //logout(email) {}

    //logoutRefresh(refreshToken) {}
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
