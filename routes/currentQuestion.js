const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;

router.get("/", (req, res) => {
  const q = "SELECT * FROM labyrinth_questions WHERE question_id = (?)";
  const values = [req.body.ques_id];
  var qs=[];
  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }

    return array;
  }
  mysql.query(q, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.send({
        code: -1,
        message: err.message,
      });
    } else {
      if (data.length != 0) {
         qs=data[0].question_string;
        //  console.log(qs);
        shuffle(qs);
        res.send(qs[0]);
      } else {
        return res.send("Question doesn't exist");
      }
    }
  });
});

module.exports = router;
