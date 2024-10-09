const responseBuilder = (res, statusCode, message, data = null, options = {}) => {
    const { totalData = null, pageNo = null, limit = null } = options;

    const response = {
        success: statusCode >= 200 && statusCode < 300,  // Success for 2xx status codes
        message: message || (statusCode >= 200 && statusCode < 300 ? 'Success' : 'Error'),
        data: data || null,
    };

    // Optionally include pagination info if provided
    if (totalData !== null && pageNo !== null && limit !== null) {
        response.pagination = {
            totalData,
            pageNo,
            limit,
        };
    }

    // Send the response
    return res.status(statusCode).json(response);
};

module.exports = responseBuilder;