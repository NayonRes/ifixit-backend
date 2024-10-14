const { check, validationResult } = require('express-validator');
const { validate, ValidationError, Joi } = require('express-validation')
const validationResponseBuilder = require("../builder/validationResponseBuilder")
const branchModel = require("../db/models/branchModel");

const storeUserRule = [
    check('name')
        .trim()
        .notEmpty().withMessage('The name is required'),

    check('branch_id')
        .trim()
        .notEmpty().withMessage('The Branch ID is required')
        .custom(async value => {
            const branch = await branchModel.findOne({_id: value});
            if (!branch) {
                return false
            }
            return true;
        })
        .withMessage('The branch ID does not matched'),

    check('number')
        .trim()
        .isEmail()
        .withMessage('The Mobile number is required'),

    check('email')
        .trim()
        .isEmail().withMessage('The email is not valid'),

    check('email')
        .trim()
        .notEmpty().withMessage('The email is required'),

    check('password')
        .trim()
        .notEmpty()
        .withMessage('The password is required'),

    check('password')
        .trim()
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),

    check('password')
        .trim()
        .isLength({ max: 32 })
        .withMessage('Password cannot be more than 32 characters'),

    (req, res, next) => {
    console.log(req.body)
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