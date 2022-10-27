import argon from 'argon2';
import Chance from 'chance';
import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';

import Explorateur from '../models/explorateur.model.js';

const chance = new Chance();

class ExplorateurRepository {
    retrieveByEmail(courriel) {
        return Explorateur.findOne({ courriel: courriel }).populate('creatures');
    }

    async login(email, password) {
        const account = await Explorateur.findOne({ email: email });
        if (!account) {
            return { err: HttpErrors.Unauthorized() };
        } else {
            const passwordValid = await argon.verify(account.motDePasse, password);
            if (passwordValid) {
                return { account };
            } else {
                return { err: HttpErrors.Unauthorized() };
            }
        }
    }

    validatePassword(password, account) {}

    async create(account) {
        try {
            account.motDePasse = await argon.hash(account.password);
            delete account.password;
            return Explorateur.create(account);
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
        explorateur.creatures.forEach(c => {
            delete c.id;
            delete c._id;
        });
        delete explorateur.motDePasse;
        delete explorateur._id;
        delete explorateur.id;
        delete explorateur.__v;

        return explorateur;
    }
}

export default new ExplorateurRepository();
