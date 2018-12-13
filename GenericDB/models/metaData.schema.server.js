const mongoose = require('mongoose')
const metaDataSchema = mongoose.Schema({
        tableName : String,
        fields :{
        }
}, {collection : 'tables'});

module.exports = metaDataSchema;