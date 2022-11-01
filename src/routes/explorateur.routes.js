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
<<<<<<< Updated upstream
        router.get('/explorateur',this.getOne);
        router.get('/',this.getAll);
=======
        router.get('/:email',this.getOne);
        router.get('/',guardAuthorizationJWT,this.getAll);
>>>>>>> Stashed changes
    }

    async getOne(req,res,next){
        
<<<<<<< Updated upstream
        const { courriel } = req.body;
       
        const result = await explorateurRepository.retrieveByEmail(courriel);
        
        if (result.nom) {
=======
        const courriel = req.params.email;
        const result = await explorateurRepository.retrieveByEmail(courriel);
        console.log(req.params.email);
        console.log(result);
        try {
>>>>>>> Stashed changes
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
            console.log("top kek");
            console.log(req.body);
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

   
    async login(req, res, next) {
        const { courriel, motDePasse } = req.body;
        console.log("gros sale");
        console.log(req.body);
        console.log(courriel + " " + motDePasse);
        try {
            const result = await explorateurRepository.login(courriel, motDePasse);
            let explorateur = result;
          
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
            const account = await explorateurRepository.retrieveById(req.refreshToken.id);
            const tokens = explorateurRepository.generateJWT(account.email, account._id);
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
