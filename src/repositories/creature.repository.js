import argon from 'argon2';
import Chance from 'chance';
import jwt from 'jsonwebtoken';
import HttpErrors from 'http-errors';

import Creature from '../models/creature.model.js';

class CreatureRepository {

    async create(creature) {
        try {
            return Creature.create(creature);
        } catch (err) {
            throw err;
        }
    }
}
export default new CreatureRepository();