var mysql = require('mysql');

var pool  = mysql.createPool({
  connectionLimit : 10,
  queueLimit: 100,
  host : process.env.DB_HOST || '127.0.0.1',
  port : process.env.DB_PORT || 3306,
  user : process.env.DB_USER || 'root',
  password : process.env.DB_PASSWORD || 'root',
  database : process.env.DB_NAME || 'testdb',
  connectTimeout : 10000,
  waitForConnections: true,
  acquireTimeout: 10000,
  debug : false
});

pool.on('connection', function (connection) {
  console.log('MySQL DB Connection established');
});

pool.on('acquire', function (connection) {
  console.log('Connection %d acquired', connection.threadId);
});

pool.on('enqueue', function () {
  console.log('Waiting for available connection slot...');
});

pool.on('release', function (connection) {
  console.log('Connection %d released', connection.threadId);
});

module.exports = pool;
