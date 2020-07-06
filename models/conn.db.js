var mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "fobass",
    password: "Clubmix081416",
    database: "TradeNear_DB"
  });

module.exports = { con }