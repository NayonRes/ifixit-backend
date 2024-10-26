const { check, validationResult } = require('express-validator');
const branchModel = require("../db/models/branchModel");
const validationHandler = require("../builder/validationHandler");

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

    check('mobile')
        .trim()
        .notEmpty()
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


    validationHandler
];

module.exports = storeUserRule;