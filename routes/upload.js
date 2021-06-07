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

var save_file = function(file_att, res){
  try{
    var file_name = file_att.originalname;
    var file_type = file_att.mimetype;
    var content = fs.readFileSync(file_att.path);
    mysqlpool.getConnection(function(err, connection) {
      let data = {
        "file_name": file_name,
        "file_type": file_type,
        "file_content": content,
        "size": file_att.size,
        "uuid" : uuidv4()

      }
      connection.query('INSERT INTO docs SET ?', data, function(err,
        result) {
          var is_failed = false, error;
          if(err){
            error=err.message;
            console.error(err.message);
            is_failed=true;
          }
          fs.unlink(file_att.path, function(err) {
            if (err) {
              console.error(err.message);
            } 
            if(is_failed){
              res.status(500).json({"status": 500, "message": error});
            } else
              res.json({"status": 200, "message":"file uploaded"});
          });
        });
    });
  }catch(err){
    res.status(500).json({"status": "ERROR", "message":"file uploade failed :" + err.message});
  }
}

router.post('/', upload_multer.single('document'), function(req, res, next) {
  try{
      console.log("is it working");
      var file_att = req.file;
      save_file(file_att,res);//file_att.originalname, file_att.mimetype, file_att.path, res);
  }catch(err){
    console.error(err);
    res.status(500);
    res.json({
      'status': 500,
      'message': err
    });
    res.end();
  }
});

module.exports = router;
