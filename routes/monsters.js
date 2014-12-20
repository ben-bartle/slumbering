var express = require('express');
//validator
var validate = require('jsonschema').validate;

var schema = require('../schemas/monster.json');

var router = express.Router();

/* GET monsters listing. */
router.get('/', function(req, res) {
	var db = req.db;
    db.collection('monsters').find().toArray(function (err, items) {
        res.json(items);
    });
});

/*
 * POST to monsters.
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

    db.collection('monsters').insert(req.body, function(err, result){
    	if (err) return next(err);
        res.send(result);
    });
});



/*
 * PUT to monsters/id
 */
router.put('/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    db.collection('monsters').updateById(id, {$set: req.body}, {safe:true,multi:false},function(err, result) {
        res.send(
        	(err === null) ? { msg: '' } : { msg: err }
        );
    });
});

/*
 * DELETE to monsters/id
 */
router.delete('/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    db.collection('monsters').removeById(id, function(err, result) {
        res.send((result === 1) ? { msg: '' } : { msg:'error: ' + err });
    });
});



module.exports = router;
