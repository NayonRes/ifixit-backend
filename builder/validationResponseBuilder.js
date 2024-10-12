const validationResponseBuilder = (res, errors = null, options = {}) => {

    const response = {
        success: false,  // Success for 2xx status codes
        message: "Some of your params are not valid",
        errors: errors || null,
    };

    // Send the response
    return res.status(422).json(response);
};

module.exports = validationResponseBuilder;