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
        router.post('/refresh', guardRefreshTokenJWT,  this.refreshToken);
        router.delete('/logout', this.logout);
        router.get('/explorateur/:email',this.getOne);
        router.get('/',this.getAll);
    }

    async getOne(req,res,next){
        
        const courriel = req.params.email;
       console.log("GROS KEK SALE" + courriel);
        const result = await explorateurRepository.retrieveByEmail(courriel);
        
        if (result.nom) {
            let explorateur = result.toObject({ getters: true, virtuals: true });
            explorateur = explorateurRepository.transform(explorateur);
            res.status(200).json(explorateur);
        } else {
            res.status(404);
        }
    }

    async getAll(req,res,next){
       console.log("BRUH");
       const result = await explorateurRepository.retrieveAll();
        console.log(result);
        try {
            const transformExplorateurs = result.map(e => {
                e = e.toObject({ getters: false, virtuals: true });
                e = explorateurRepository.transform(e);
                return e;
            })
            console.log(transformExplorateurs);
            res.status(200).json(transformExplorateurs);
        } catch(error) {
            res.status(404).send("not found /" + error);
        }
    }

    async post(req, res, next) {
        try {
            console.log(req.body);
            let explorateur = await explorateurRepository.create(req.body);
            explorateur = explorateur.toObject({ getters: false, virtuals: false });
            //Génération du token
            let tokens = explorateurRepository.generateJWT(explorateur.email, explorateur._id);

            explorateur = explorateurRepository.transform(explorateur);
            res.status(201).json({ explorateur, tokens });
        } catch (err) {
            return next(err);
        }
    }

   
    async login(req, res, next) {
        const { courriel, motDePasse } = req.body;
        try {
            let explorateur = await explorateurRepository.login(courriel, motDePasse);
            
            explorateur = explorateur.explorateur;
            explorateur = explorateur.toObject({virtuals:true});
            //TODO: Token
            let tokens = explorateurRepository.generateJWT(courriel, explorateur._id);

            explorateur = explorateurRepository.transform(explorateur);
            res.status(201).json({ explorateur, tokens });
        } catch(err) {
            return next(err);
        }
    }

    async refreshToken(req, res, next) {

        try {
            const explorateur = await explorateurRepository.retrieveById(req.refreshToken.id);
            const tokens = explorateurRepository.generateJWT(explorateur.email, explorateur._id);
            res.status(201).json({ tokens });
        } catch(err) {
            return next(err);
        }


    }

    async logout(req, res, next) {

        
    }
}

new ExplorateurRoutes();
export default router;
