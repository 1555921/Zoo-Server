import argon from 'argon2';
import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';
import Explorateur from '../models/explorateur.model.js';
import { ELEMENTS } from '../utils/constants.js';


class ExplorateurRepository {
    retrieveByEmail(courriel) {
        return Explorateur.findOne({ courriel: courriel }).populate('creatures').populate('explorations');
    }

    retrieveById(id) {
        return Explorateur.findOne({ _id: id }).populate('creatures').populate('explorations');
    }
    async login(courriel, motDePasse) {
        const explorateur = await Explorateur.findOne({ courriel: courriel }).populate('creatures');
        if (!explorateur) {
            
            return { err: HttpErrors.Unauthorized() };
        } else {
            const motDePasseValide = await argon.verify(explorateur.motDePasse, motDePasse);
            if (motDePasseValide) {
                return { explorateur };
            } else {
                return { err: HttpErrors.Unauthorized() };
            }
        }
    }

    validatePassword(motDePasse, explorateur) {}

    async create(explorateur) {
        try {
            
            explorateur.motDePasse = await argon.hash(explorateur.motDePasse);
            //delete explorateur.motDePasse;
            explorateur.elements = ELEMENTS
            return Explorateur.create(explorateur);
        } catch (err) {
            throw err;
        }
    }



    generateJWT(email, id) {
        const accessToken = jwt.sign({ email }, process.env.JWT_TOKEN_SECRET, {
            expiresIn: process.env.JWT_TOKEN_LIFE,
            issuer: process.env.BASE_URL
        });
        const refreshToken = jwt.sign({ id }, process.env.JWT_REFRESH_SECRET, {
            expiresIn: process.env.JWT_REFRESH_LIFE,
            issuer: process.env.BASE_URL
        });

        return { accessToken, refreshToken };
    }

    async validateRefreshToken(email, refreshToken) {}

    logout(email) {}

    logoutRefresh(refreshToken) {}
    transform(explorateur) {
        if(explorateur.creatures){
            explorateur.creatures.forEach(c => {
                delete c.id;
                delete c._id;
            });
        }
        delete explorateur.motDePasse;
        delete explorateur._id;
        delete explorateur.id;
        delete explorateur.__v;
        return explorateur;
    }
}

export default new ExplorateurRepository();
