const { check, validationResult } = require('express-validator');
const validationResponseBuilder = require("../builder/validationResponseBuilder")

const storeUserRule = [
    check('email').isEmpty().withMessage('The email is required'),
    check('email').isEmail().withMessage('The email is not valid'),
    check('password').isEmpty().withMessage('The password is required'),
    check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    check('password').isLength({ max: 32 }).withMessage('Password cannot be more than 32 characters'),
    (req, res, next) => {
        const errors = validationResult(req);
        console.log(errors);
        if (!errors.isEmpty()) {
            // Create an object to return errors by field (key)
            let errorObject = {};
            errors.array().forEach(error => {
                errorObject[error.path] = error.msg;
            });
            return validationResponseBuilder(res, errorObject)
        }
        next();
    }
];

module.exports = storeUserRule;