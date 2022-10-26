import express from 'express';
import httpErrors from 'http-errors';

import explorateurRepository from '../repositories/explorateur.repository.js';
import accountsValidator from '../validators/accounts.validator.js';

import { guardAuthorizationJWT, guardRefreshTokenJWT } from '../middlewares/authorization.jwt.js';

const router = express.Router();

class ExplorateurRoutes {
    constructor() {
        router.post('/', this.post);
        router.post('/login', this.login);
        router.post('/refresh', guardRefreshTokenJWT,  this.refreshToken);
        router.get('/secure', guardAuthorizationJWT, this.secure);
        router.delete('/logout', this.logout);
        router.get('/explorateur',this.getOne);
    }

    async getOne(req,res,next){
        const { courriel } = req.body;
       
        const result = await explorateurRepository.retrieveByEmail(courriel);
        console.log(result);
        if (result.nom) {
            let explorateur = result.toObject({ getters: false, virtuals: false });
            
            

            explorateur = explorateurRepository.transform(explorateur);
            res.status(200).json(explorateur);
        } else {
            res.status(500);
        }
    }

    async post(req, res, next) {
        try {
            let account = await explorateurRepository.create(req.body);
            account = account.toObject({ getter: false, virtuals: false });
            //Génération du token
            let tokens = explorateurRepository.generateJWT(account.email, account._id);

            account = explorateurRepository.transform(account);
            res.status(201).json({ account, tokens });
        } catch (err) {
            return next(err);
        }
    }

    async secure(req, res, next) {
        try {
            res.status(200).json(req.auth);
        } catch (err) {
            return next(err);
        }
    }

    async login(req, res, next) {
        const { email, password } = req.body;

        const result = await explorateurRepository.login(email, password);
        if (result.account) {
            let account = result.account.toObject({ getters: false, virtuals: false });
            //TODO: Token
            let tokens = explorateurRepository.generateJWT(email, account._id);

            account = explorateurRepository.transform(account);
            res.status(201).json({ account, tokens });
        } else {
        }
    }

    async refreshToken(req, res, next) {

        try {
            const account = await explorateurRepository.retrieveById(req.refreshToken.id);
            const tokens = explorateurRepository.generateJWT(account.email, account._id);
            res.status(201).json({ tokens });
        } catch(err) {
            return next(err);
        }


    }

    async logout(req, res, next) {}
}

new ExplorateurRoutes();
export default router;
