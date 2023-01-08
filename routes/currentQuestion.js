const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;

router.get("/", (req, res) => {
  const q = "SELECT * FROM labyrinth_questions WHERE ques_id = (?)";
  const values = [req.body.ques_id];
  mysql.query(q, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.send({
        code: -1,
        message: err.message,
      });
    } else {
      if (data.length != 0) {
        return res.status(200).json(data[0].question_string);
      } else {
        return res.send("Question doesn't exist");
      }
    }
  });
});

module.exports = router;
