const mongoose = require('mongoose');
const metaDataSchema = require('./metaData.schema.server');
module.exports = mongoose.model('Tables', metaDataSchema);