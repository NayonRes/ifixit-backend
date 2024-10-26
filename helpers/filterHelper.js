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

    if (req.query.sku) {
        query.sku = new RegExp(`^${req.query.sku}$`, "i");
    }
    if (req.query.category_id) {
        query.category_id = new RegExp(`^${req.query.category_id}$`, "i");
    }
    if (parseInt(req.query.minPrice) && parseInt(req.query.maxPrice)) {
        query.price = {
            $gte: parseInt(req.query.minPrice),
            $lte: parseInt(req.query.maxPrice),
        };
    } else if (parseInt(req.query.minPrice)) {
        query.price = {
            $gte: parseInt(req.query.minPrice),
        };
    } else if (parseInt(req.query.maxPrice)) {
        query.price = {
            $lte: parseInt(req.query.maxPrice),
        };
    }
    console.log("startDate", req.query.startDate);
    if (req.query.startDate && req.query.endDate) {
        query.created_at = {
            $gte: new Date(`${req.query.startDate}T00:00:00.000Z`),
            $lte: new Date(`${req.query.endDate}T23:59:59.999Z`),
        };
    } else if (req.query.startDate) {
        query.created_at = {
            $gte: new Date(`${req.query.startDate}T00:00:00.000Z`),
        };
    } else if (req.query.endDate) {
        query.created_at = {
            $lte: new Date(`${req.query.endDate}T23:59:59.999Z`),
        };
    }
    return query;
}

module.exports = filterHelper;