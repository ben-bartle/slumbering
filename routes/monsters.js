'use strict';

var express = require('express');
//validator
var validate = require('jsonschema').validate;

var schema = require('../schemas/monster.json');

var router = express.Router();



/* GET monsters listing. */
/*router.get('/', function(req, res) {

	var db = req.db;
    db.collection('monsters').find().sort('name').toArray(function (err, items) {
        res.json(items);
    });
});*/

/* GET monster. */
router.get('/:id?', function(req, res) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    
    var db = req.db;
    var id = req.params.id;
    if (id){
        db.collection('monsters').findById(id, function (err, item) {
            res.json(item);
        }); 
    } else {
        db.collection('monsters').find().toArray(function (err, items) {
            res.json(items);
        });    
    }
    
});

/*
 * POST to monsters.
 */
router.post('/', function(req, res, next) {
    
    var db = req.db;
  /*  var v = validate(req.body,schema);
    if (v.errors.length>0){
    	//res.send({msg:v.errors});
    	var err = new Error('validation failed');
    	err.status = 400;
    	return next(err);
    }
*/
    db.collection('monsters').insert(req.body, function(err, result){
    	if (err) return next(err);
        res.send(result);
    });
});



/*
 * PUT to monsters/id
 */
router.put('/:id', function(req, res, next) {
    var db = req.db;
    var id = req.params.id;

    var data = req.body;
    
    //clean up and validate for update
    delete data._id;
    delete data.editing;
    delete data.collapsed;
    delete data.challengeVal;
    
    var v = validate(data,schema);
    if (v.errors.length>0){
        console.log(v.errors);
        var err = new Error('validation failed');
        err.status = 400;
        return next(err);
    }

    db.collection('monsters').updateById(id, {$set: data}, {safe:true,multi:false},function(err, result) {
        //todo: error handling
        res.status = 200;
        res.send('');
    });
});

/*
 * DELETE to monsters/id
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    db.collection('monsters').removeById(id, function(err, result) {
        //todo: error handling
        res.send(result);
    });
});



module.exports = router;
