const mysql = require("mysql");
const con = mysql.createConnection({
  host: "sql6.freemysqlhosting.net",
  user: "sql6588955",
  password: "yCEe4wfMQM",
  database: "sql6588955",
  port:3306
  
});
con.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connected");
  }
});
module.exports.con=con;