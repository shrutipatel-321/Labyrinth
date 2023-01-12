const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;

router.get("/", (req, res) => {

  const q = "SELECT current_ques_id FROM current_status WHERE Team_ID= (?)";
  const values = [req.body.Team_ID];
  mysql.query(q, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.send({
        code: -1,
        message: err.message,
      });
    }
    else {
      if (data.length != 0) {
        q2 = "SELECT question_string FROM labyrinth_questions WHERE question_id = (?)";
        const values2 = [data[0].current_ques_id];

        mysql.query(q2, [values2], (err, data2) => {
          if (err) {
            console.log(err);
            return res.send({
              code: -1,
              message: err.message,
            });
          } else {
            // console.log(data2)

            return res.json({

              code: 0,
              question : data2[0].question_string
            }
            );
          }
          // return res.status(200).json(data[0].question_string);
        });
      }
      else {
        return res.send("Team doesn't exist");
      }
    }
  });
});

module.exports = router;
