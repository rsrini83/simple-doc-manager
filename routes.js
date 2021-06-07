var express = require('express');
var app = express();

// Defining all the routes
var index = require('./routes/index');
var docs = require('./routes/docs');
var upload = require('./routes/upload');
var download = require('./routes/download');

// Linking all the routes
app.use('/', index);
app.use('/docs', docs);
app.use('/upload', upload);
app.use('/download', download);
module.exports = app;
