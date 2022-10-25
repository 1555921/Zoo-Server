import expressValidator from 'express-validator';

const { body } = expressValidator;

class AccountsValidators {
    createValidator() {
        return [];
    }
}


export default new AccountsValidators();