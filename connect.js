const mysql = require('mysql');

const conn = mysql.createConnection({
    host        : 'localhost',
    user        : 'root',
    password    : '',
    database    : 'note'
})

conn.connect (function (err) {
    if (err) throw err;
});

module.exports = conn;