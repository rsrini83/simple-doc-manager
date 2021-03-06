var toobusy = require('node-toobusy');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('express-handlebars');
var logger = require('morgan');
var loggerutil = require('./utilities/logger');
var datalogger = require('./utilities/datalogger');
var fs = require('fs');
var rfs = require('rotating-file-stream');
var helmet = require('helmet');
var compression = require('compression');

// Defining routes
var routes = require('./routes');

// Generating an express app
var app = express();

// compress all responses
app.use(compression());

// middleware which blocks requests when server is too busy
app.use(function(req, res, next) {
  if (toobusy()) {
    res.status(503);
    res.send("Server is busy right now, sorry.");
  } else {
    next();
  }
});

// Linking log folder and ensure directory exists
var logDirectory = path.join(__dirname, 'log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
fs.appendFile('./log/ServerData.log', '', function (err) {
  if (err) throw err;
});

// view engine setup - Express-Handlebars
app.engine('hbs', hbs({
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: __dirname + '/views/'
}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Create a rotating write stream
var accessLogStream = rfs.createStream('Server.log', {
    size: "10M", // rotate every 10 MegaBytes written
    interval: '1d', // rotate daily
    compress: "gzip", // compress rotated files
    path: logDirectory
});

// Generating date and time for logger
logger.token('datetime', function displayTime() {
    return new Date().toString();
});

// Allowing access headers and requests
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "HEAD, OPTIONS, GET, POST, PUT, PATCH, DELETE, CONNECT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});

// defining mode of logging
app.use(logger('dev'));
app.use(logger(':remote-addr :remote-user :datetime :req[header] :method :url HTTP/:http-version :status :res[content-length] :res[header] :response-time[digits] :referrer :user-agent', {
    stream: accessLogStream
}));

// uncomment to redirect global console object to log file
// datalogger.logfile();

// Helmet helps for securing Express apps by setting various HTTP headers
app.use(helmet({
  contentSecurityPolicy: false,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(favicon(path.join(__dirname, 'public', 'ficon.ico')));

// Linking routes
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.get('/download/:uuid', function(req, res, next){
  var options = {
    root: path.join(__dirname, "uploads")
  };
  res.sendFile(uuid, options, function (err) {
      if (err) {
          next(err);
      } else {
          console.log('Sent:', fileName);
      }
  });
})

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
  // uncomment to just send error as JSON
  res.send({"message":"404 Page Not Found..!"});
  // uncomment to render the error page
  // res.render('error');
});

// globally catching unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
   console.error('Unhandled Rejection at promise '+promise+' reason ', reason);
   console.log('Server is still running...\n');
});

// globally catching unhandled exceptions
process.on('uncaughtException', (error) => {
   console.error('Uncaught Exception is thrown with ',error+'\n');
   process.exit();
});

module.exports = app;
