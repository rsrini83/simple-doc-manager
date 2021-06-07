var express = require('express');
var router = express.Router();
var mysqlpool = require('../dbconfig');

/* GET users listing. */
router.get('/', function(req, res, next) {
  mysqlpool.getConnection(function(err, connection) {
    connection.query('SELECT * FROM docs order by id desc', function (error, results, fields) {
      connection.release();
      if (error) throw error;
      //res.render('index', { title: 'Express', data: JSON.stringify(results, null, 4) });
       res.json({
         "status": "Success", 
         "data": results
        });
      });
    });
});

module.exports = router;
