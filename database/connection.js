const mysql = require("mysql2");
require('dotenv').config();

const con = mysql.createConnection({
  host: `${process.env.MYSQLHOST}`,
  user: `${process.env.MYSQLUSER}`,
  password: `${process.env.MYSQLPASSWORD}`,
  database: `${process.env.MYSQLDATABASE}`,
  port:`${process.env.MYSQLPORT}`
  
});
con.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connected");
  }
});
module.exports.con=con;
