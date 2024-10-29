const { check, validationResult } = require('express-validator');
const branchModel = require("../db/models/branch");
const validationHandler = require("../builder/validationHandler");

const updateUserRule = [
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
        .isLength({ max: 32 })
        .withMessage('Password cannot be more than 32 characters'),

    validationHandler
];

module.exports = updateUserRule;