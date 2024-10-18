// validationHandler.js
const { validationResult } = require('express-validator');
const validationResponseBuilder = require("../builder/validationResponseBuilder");

const validationHandler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        // Create an object to return errors by field (key)
        let errorObject = {};
        errors.array().forEach(error => {
            errorObject[error.param] = error.msg;
        });
        return validationResponseBuilder(res, errorObject);
    }
    next();
};

module.exports = validationHandler;