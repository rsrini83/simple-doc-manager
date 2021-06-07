var express = require('express');
var router = express.Router();
var multer = require('multer');
var mysqlpool = require('../dbconfig');
var fs = require('fs');
var upload_multer = multer({ dest: 'uploads/' });
const { 
  v1: uuidv1,
  v4: uuidv4,
} = require('uuid');

router.get('/:uuid', function(req, res, next) {
  console.log(req.params.uuid);
  mysqlpool.getConnection(function(err, connection) {
    data = {uuid: req.params.uuid};
    connection.query("select * from docs where uuid='"+ req.params.uuid +"'",function(err, result){
      console.log(err);
      if(result){
        console.log(result[0].file_type);
          res.writeHead(200, [
            ['Content-Type', result[0].file_type],
            ["Content-Disposition", "attachment; filename=" + result[0].file_name]
          ]);
          var buffer = new Buffer.from(result[0].file_content, 'binary');
          res.end(buffer);
        }
      });
  });
});

module.exports = router;
