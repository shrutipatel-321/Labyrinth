const mysql = require("mysql2");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456789",
  database: "labyrinth"
  
});
con.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connected");
  }
});
module.exports.con=con;