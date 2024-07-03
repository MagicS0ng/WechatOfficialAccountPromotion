const logger = require('../utils/logger');

function errorHandler(err, req, res, next) {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandler;
