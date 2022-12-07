import express from 'express';
import httpErrors from 'http-errors';

import explorateurRepository from '../repositories/explorateur.repository.js';
import explorateursValidator from '../validators/explorateurs.validator.js';

import { guardAuthorizationJWT, guardRefreshTokenJWT } from '../middlewares/authorization.jwt.js';

const router = express.Router();

class ExplorateurRoutes {
    constructor() {
        router.post('/', this.post);
        router.post('/login', this.login);
        router.post('/refresh', guardRefreshTokenJWT, this.refreshToken);
        router.delete('/logout', this.logout);
        router.get('/explorateur', guardAuthorizationJWT, this.getOne);
    }

    async getOne(req,res,next){
        const courriel = req.body.courriel
        //const courriel = req.params.email;
        const result = await explorateurRepository.retrieveByEmail(courriel);
        
        if (result.nom) {
            let explorateur = result.toObject({ getters: true, virtuals: true });
            explorateur = explorateurRepository.transform(explorateur);
            console.log(explorateur);
            res.status(200).json(explorateur);
        } else {
            res.status(404);
        }
    }

    async post(req, res, next) {
        try {
            let explorateur = await explorateurRepository.create(req.body);
            explorateur = explorateur.toObject({ getters: false, virtuals: true });
            //Génération du token
            let tokens = explorateurRepository.generateJWT(explorateur.email, explorateur._id);

            explorateur = explorateurRepository.transform(explorateur);
            res.status(201).json({ explorateur, tokens });
        } catch (err) {
            return next(err);
        }
    }

    async login(req, res, next) {
        console.log(req.body)
        const { courriel, motDePasse } = req.body;
        try {
            let explorateur = await explorateurRepository.login(courriel, motDePasse);
            explorateur = explorateur.explorateur;
            explorateur = explorateur.toObject({ virtuals: true });
            let tokens = explorateurRepository.generateJWT(courriel, explorateur._id);
            explorateur = explorateurRepository.transform(explorateur);
            res.status(200).json({ explorateur, tokens });
        } catch (err) {
            console.log(err)
            return next(err);
        }
    }

    async refreshToken(req, res, next) {
        try {
            let explorateur = await explorateurRepository.retrieveById(req.refreshToken.id);
            let tokens = explorateurRepository.generateJWT(explorateur.courriel, explorateur._id);
            res.status(200).json({ tokens });
        } catch (err) {
            return next(err);
        }
    }

    async logout(req, res, next) {}
}

new ExplorateurRoutes();
export default router;
