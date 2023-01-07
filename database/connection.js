const mysql = require("mysql");
const con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "labyrinth",
  port: 3306,
});
con.connect((err) => {
  if (err) {
    console.log(err.message);
  } else {
    console.log("connected");
  }
});
module.exports.con=con;