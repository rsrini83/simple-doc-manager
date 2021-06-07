var express = require('express');
var router = express.Router();
var mysqlpool = require('../dbconfig');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express', data: {} });
});

module.exports = router;
