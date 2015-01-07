'use strict';

var express = require('express');
//validator
var validate = require('jsonschema').validate;

var schema = require('../schemas/spell.json');

var router = express.Router();

/* GET spell. */
router.get('/:id?', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");

    var db = req.db;
    var id = req.params.id;
    if (id){
        db.collection('spells').findById(id, function (err, item) {
            res.json(item);
        }); 
    } else {
        db.collection('spells').find().sort('name').toArray(function (err, items) {
            res.json(items);
        });    
    }
    
});

/*
 * POST to spells.
 */
router.post('/', function(req, res, next) {
    
    var db = req.db;
    var v = validate(req.body,schema);
    if (v.errors.length>0){
    	//res.send({msg:v.errors});
    	var err = new Error('validation failed');
    	err.status = 400;
    	return next(err);
    }

    db.collection('spells').insert(req.body, function(err, result){
    	if (err) return next(err);
        console.log(result[0]);
        res.send(result[0]);
    });
});



/*
 * PUT to spells/id
 */
router.put('/:id', function(req, res, next) {
    var db = req.db;
    var id = req.params.id;

    var data = req.body;
    
    //clean up and validate for update
    delete data._id;
    delete data.editing;
    delete data.collapsed;
    delete data.order;
    
    var v = validate(data,schema);
    if (v.errors.length>0){
        console.log(v.errors);
        var err = new Error('validation failed');
        err.status = 400;
        return next(err);
    }

    db.collection('spells').updateById(id, {$set: data}, {safe:true,multi:false},function(err, result) {
        //todo: error handling
        res.status = 200;
        res.send('');
    });
});

/*
 * DELETE to spells/id
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    db.collection('spells').removeById(id, function(err, result) {
        //todo: error handling
        res.send(result);
    });
});



module.exports = router;
