var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var _ = require('lodash');



const mongoose = require ('mongoose');
mongoose.connect('mongodb://himanshu:qwertyuiop123@ds023550.mlab.com:23550/heroku_48hhfwgp');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use( function(req, res, next) {
    res.header('Access-Control-Allow-Origin', "*");
    res.header('Access-Control-Allow-Headers', "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', "GET,PUT,POST,DELETE, OPTIONS");


    next();
});


var dao = require('./daos/generic.dao.server');


app.get('/api/hello',
    (req, res) => {

        res.send("Hii");


    });

app.post('/api/:table',
    (req, res) => {

        var collectionName = req.param("table");
        dao.createSingleTable(collectionName, req.body, res)


    });


app.get('/api/:table',
    (req, res) => {

        var collectionName = req.param("table");
        dao.findAllRecords(collectionName, req.query)
            .then(function (records) {
                res.send(records)
            });
    });

app.get('/api/:table/:id',
    (req, res) => {
        var collectionName = req.param("table");
        var id = req.param("id");
        dao.findRecordById(collectionName, id)
            .then(function (record) {
                res.send(record)
            });
    });


app.delete('/api/:table/:id',
    (req, res) => {

        var collectionName = req.param("table");
        var id = req.param("id");
        dao.deleteRecordById(collectionName, id)
            .then(function (record) {
                res.send(record)
            });
    });

app.delete('/api/:table',
    (req, res) => {

        var collectionName = req.param("table");
        dao.deleteAllRecords(collectionName)
            .then(function (record) {
                res.send(record)
            });
    });


app.put('/api/:table/:id',
    (req, res) => {

        var collectionName = req.param("table");
        var id = req.param("id");
        dao.putRecordById(collectionName, id, req.body, res)
    });


app.post('/api/:table1/:id1/:table2/:id2',
    (req, res) => {

        var table1 = req.param("table1");
        var id1 = req.param("id1");

        var table2 = req.param("table2");
        var id2 = req.param("id2");


        var tables = [];
        tables.push(
            {
                "tname" : table1,
                "id" : id1
            }
        );

        tables.push(
            {
            "tname" : table2,
            "id" : id2
            }
        );

        orderedTable = _.sortBy(tables, t =>  t.tname);
        var newTableName = orderedTable.map(x => x.tname).join("_");
        dao.createMappingTable(newTableName , orderedTable)
            .then(function (response) {

                res.send(response);
            })

    });


app.delete('/api/:table1/:id1/:table2/:id2',
    (req, res) => {

        var table1 = req.param("table1");
        var id1 = req.param("id1");

        var table2 = req.param("table2");
        var id2 = req.param("id2");


        var tables = [];
        tables.push(
            {
                "tname" : table1,
                "id" : id1
            }
        );

        tables.push(
            {
                "tname" : table2,
                "id" : id2
            }
        );

        orderedTable = _.sortBy(tables, t =>  t.tname);
        var newTableName = orderedTable.map(x => x.tname).join("_");
        dao.deleteRecordMappingTable(newTableName , orderedTable)
            .then(function (response) {

                res.send(response);
            })

    });


app.delete('/api/:table1/:id1/:table2',
    (req, res) => {

        var table1 = req.param("table1");
        var id1 = req.param("id1");

        var table2 = req.param("table2");


        var tables = [];
        tables.push(
            {
                "tname" : table1,
                "id" : id1
            }
        );

        tables.push(
            {
                "tname" : table2,
                "id" : undefined
            }
        );

        var orderedTable = _.sortBy(tables, t =>  t.tname);
        var newTableName = orderedTable.map(x => x.tname).join("_");
        dao.deleteMultipleRecordMappingTable(newTableName , table1, id1, orderedTable)
            .then(function (response) {

                res.send(response);
            })

    });


app.get('/api/:table1/:id1/:table2',
    (req, res) => {

        var table1 = req.param("table1");
        var id1 = req.param("id1");

        var table2 = req.param("table2");


        var tables = [];
        tables.push(
            {
                "tname" : table1,
                "id" : id1
            }
        );

        tables.push(
            {
                "tname" : table2,
                "id" : undefined
            }
        );

        orderedTable = _.sortBy(tables, t =>  t.tname);
        var newTableName = orderedTable.map(x => x.tname).join("_");

        dao.getRecordsFromMapping(newTableName , table1, id1, table2, orderedTable, res);
    });


app.listen(process.env.PORT || 3000);