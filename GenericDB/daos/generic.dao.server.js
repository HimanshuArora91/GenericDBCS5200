const mongoose = require('mongoose')
const metaDataModel =  require("../models/metaData.model.server");
var _ = require('lodash');


const findAllMetaData = () => {
    return metaDataModel.find();
};


const findAllRecords = (collectionName, query) => {
    var tempSchema = {};
    return metaDataModel.findOne({tableName: collectionName})
        .then(function (table) {
            if(!table) {
                return null;
            }
            var fields = table.fields;
            for(var i in fields) {
                var prop = fields[i];
                tempSchema[prop] = String;
            }


            var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : collectionName});
            var currentModel = mongoose.model(collectionName, currentSchema);

            delete mongoose.connection.models[collectionName];
            return currentModel.find(query);

        })
};


const findRecordById = (collectionName, id) => {
    var tempSchema = {};
    return metaDataModel.findOne({tableName: collectionName})
        .then(function (table) {
            if(!table) {
                return null;
            }
            var fields = table.fields;
            for(var i in fields) {
                var prop = fields[i];
                tempSchema[prop] = String;
            }

            var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : collectionName});
            var currentModel = mongoose.model(collectionName, currentSchema);
            delete mongoose.connection.models[collectionName];
            if(mongoose.Types.ObjectId.isValid(id)) {

                return currentModel.findOne({_id : mongoose.Types.ObjectId(id)});
            } else {
                return null;
            }
        })
};


const deleteRecordById = (collectionName, id) => {
    var tempSchema = {};
    return metaDataModel.findOne({tableName: collectionName})
        .then(function (table) {
            if(!table) {
                return null;
            }
            var fields = table.fields;
            for(var i in fields) {
                var prop = fields[i];
                tempSchema[prop] = String;
            }

            var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : collectionName});
            var currentModel = mongoose.model(collectionName, currentSchema);
            delete mongoose.connection.models[collectionName];
            if(mongoose.Types.ObjectId.isValid(id)) {

                return currentModel.deleteOne({_id : mongoose.Types.ObjectId(id)});
            } else {
                return null;
            }


        })
};



const deleteAllRecords = (collectionName) => {
    var tempSchema = {};
    return metaDataModel.findOne({tableName: collectionName})
        .then(function (table) {
            if(!table) {
                return null;
            }
            var fields = table.fields;
            for(var i in fields) {
                var prop = fields[i];
                tempSchema[prop] = String;
            }

            var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : collectionName});
            var currentModel = mongoose.model(collectionName, currentSchema);
            delete mongoose.connection.models[collectionName];
            return currentModel.deleteMany({});

        })
};

const insertRecords = (tableName , docBody,fields, res)  => {

    var tempSchema = {};
    for(var i in fields) {
        var prop = fields[i];
        tempSchema[prop] = String;
        if(!docBody.hasOwnProperty(prop)) {
            docBody[prop] = null;
        }
    }

    var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : tableName});
    var currentModel = mongoose.model(tableName, currentSchema);
    var arrayPromise = [];

    for(var j in fields) {
        var prop1 = fields[j];
        arrayPromise.push(currentModel.update(
            {[prop1] : {$exists: false}},

            {$set: {[prop1] : null }}, {multi : true}))
    }

    delete mongoose.connection.models[tableName];

    return Promise.all(arrayPromise)
        .then(function (result) {
            currentModel.create(docBody)
                .then(function (record) {
                    res.send(record);
                })

        })
};




const createSingleTable = (tableName , docBody, res) => {


   return metaDataModel.findOne({tableName: tableName})
        .then(function (table) {
            if (table == null) {
                metaDataModel.create({
                    tableName: tableName,
                    fields: Object.keys(docBody)
                }).then(function (fetchedTable) {

                    return insertRecords(tableName, docBody, fetchedTable.fields, res)
                })
            } else {

                const originalFields = table.fields;
                const newFields = Object.keys(docBody);

                var mergedFields = _.union(originalFields, newFields);

                metaDataModel.updateOne({tableName : tableName}, {
                    $set:
                        {
                            fields: mergedFields
                        }
                }). then(function (response) {
                    return insertRecords(tableName, docBody, mergedFields, res)
                })

            }
        })

};



const updateRecord = (tableName , id, docBody,fields, res)  => {

    var tempSchema = {};
    for(var i in fields) {
        var prop = fields[i];
        tempSchema[prop] = String;
    }

    var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : tableName});
    var currentModel = mongoose.model(tableName, currentSchema);
    var arrayPromise = [];

    for(var j in fields) {
        var prop1 = fields[j];
        arrayPromise.push(currentModel.update(
            {[prop1] : {$exists: false}},

            {$set: {[prop1] : null }}, {multi : true}))
    }

    delete mongoose.connection.models[tableName];

    return Promise.all(arrayPromise)
        .then(function (result) {

            if(mongoose.Types.ObjectId.isValid(id)) {

                currentModel.updateOne({_id : id}, {$set : docBody})
                    .then(function (record) {
                        currentModel.findOne({_id : id})
                            .then(function (response) {
                                res.send(response);
                            })

                    })
            } else {
                res.send(null);
            }

        })
};




const putRecordById = (tableName , id, docBody, res )=> {


    return metaDataModel.findOne({tableName: tableName})
        .then(function (table) {
            if (table == null) {
                metaDataModel.create({
                    tableName: tableName,
                    fields: Object.keys(docBody)
                }).then(function (fetchedTable) {

                    return updateRecord(tableName, id, docBody, fetchedTable.fields, res)
                })
            } else {

                const originalFields = table.fields;
                const newFields = Object.keys(docBody);

                var mergedFields = _.union(originalFields, newFields);

                metaDataModel.updateOne({tableName : tableName}, {
                    $set:
                        {
                            fields: mergedFields
                        }
                }). then(function (response) {
                    return updateRecord(tableName, id, docBody, mergedFields, res)
                })

            }
        })
};



const createMappingTable = (tableName , mappingInfo)  => {
    var fieldsNamesList =  mappingInfo.map(x => x.tname);
    var toInsertJson = {};
    tempSchema = {};

    for(var i in fieldsNamesList) {

        var prop = fieldsNamesList[i];
        tempSchema[prop] = mongoose.Types.ObjectId;
        toInsertJson[prop] = mappingInfo.find(el => el.tname == prop).id
    }


    var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : tableName});
    var currentModel = mongoose.model(tableName, currentSchema);

    delete mongoose.connection.models[tableName];
    return currentModel.create(toInsertJson)

};

const getRecordsFromMapping = (tableName , table1, id1, table2, mappingInfo, res)  => {
    var fieldsNamesList =  mappingInfo.map(x => x.tname);
    var toInsertJson = {};
    tempSchema = {};

    for(var i in fieldsNamesList) {

        var prop = fieldsNamesList[i];
        tempSchema[prop] = mongoose.Types.ObjectId;
    }


    var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : tableName});
    var currentModel = mongoose.model(tableName, currentSchema);

    delete mongoose.connection.models[tableName];

    var toReturnMovies = [];
    currentModel.find({[table1] : id1})
        .then(function (records) {

            var movieIds = records.map(el => el[table2]);
            var ind = movieIds.length;
            var query = {}
            movieIds.forEach(function (movieId) {

                findRecordById(table2, movieId)
                    .then(function (response) {
                        toReturnMovies.push(response);
                        if(ind === 1){
                            res.send(toReturnMovies)
                        }

                        ind--;
                    })
            })
        })
};

const deleteRecordMappingTable = (tableName , mappingInfo)  => {
    var fieldsNamesList =  mappingInfo.map(x => x.tname);
    var toRemoveJson = {};
    tempSchema = {};

    for(var i in fieldsNamesList) {

        var prop = fieldsNamesList[i];
        tempSchema[prop] = mongoose.Types.ObjectId;
        toRemoveJson[prop] = mappingInfo.find(el => el.tname == prop).id
    }


    var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : tableName});
    var currentModel = mongoose.model(tableName, currentSchema);

    delete mongoose.connection.models[tableName];

    console.log(toRemoveJson)
    return currentModel.remove(toRemoveJson)

};

const deleteMultipleRecordMappingTable = (tableName , table1, id1, mappingInfo)  => {
    var fieldsNamesList =  mappingInfo.map(x => x.tname);
    tempSchema = {};

    for(var i in fieldsNamesList) {

        var prop = fieldsNamesList[i];
        tempSchema[prop] = mongoose.Types.ObjectId;
    }


    var currentSchema = mongoose.Schema(tempSchema, {strict : false, collection : tableName});
    var currentModel = mongoose.model(tableName, currentSchema);

    delete mongoose.connection.models[tableName];
    return currentModel.remove({[table1] : id1})

};



module.exports = {
    createSingleTable, findAllRecords, findRecordById, deleteRecordById, deleteAllRecords,
    putRecordById, createMappingTable, getRecordsFromMapping, deleteRecordMappingTable,
    deleteMultipleRecordMappingTable
};