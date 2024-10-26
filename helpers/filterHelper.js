const filterHelper = (req) => {
    let query = {};

    // Created date range filter
    if (req.query.createdFrom || req.query.createdTo
    ) {
        query.createdAt = {};
        if (req.query.createdFrom) {
            query.createdAt.$gte = new Date(req.query.createdFrom);
        }
        if (req.query.createdTo) {
            query.createdAt.$lte = new Date(req.query.createdTo);
        }
    }

    // Updated date range filter
    if (req.query.updatedFrom || req.query.updatedTo) {
        query.updatedAt = {};
        if (req.query.updatedFrom) {
            query.updatedAt.$gte = new Date(req.query.updatedFrom);
        }
        if (req.query.updatedTo) {
            query.updatedAt.$lte = new Date(req.query.updatedTo);
        }
    }

    if (req.query.name) {
        query.name = new RegExp(`^${req.query.name}$`, "i");
    }

    if (req.query.status) {
        query.status = req.query.status;
    }

    if (req.query.parent_id) {
        query.parent_id = req.query.parent_id;
    }

    if (req.query.created_by) {
        query.created_by = req.query.created_by;
    }

    if (req.query.updated_by) {
        query.updated_by = req.query.updated_by;
    }
    return query;
}

module.exports = filterHelper;