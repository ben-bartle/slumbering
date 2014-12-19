var express = require('express');
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
router.post('/', function(req, res) {
    var db = req.db;
    db.collection('monsters').insert(req.body, function(err, result){
        res.send(
            (err === null) ? { msg: '' } : { msg: err }
        );
    });
});



/*
 * PUT to monsters/id
 */
router.put('/:id', function(req, res) {
    var db = req.db;
    var id = req.params.id;
    db.collection('monsters').updateById(id, {$set: req.body},function(err, result) {
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
