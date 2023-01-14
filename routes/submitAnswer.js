const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;
const middlewareComp = require("../middleware/middleware");

//Configuring the server side events


let team_members = [];
function eventsHandler(request, response, next) {
  const headers = {
    "Content-Type": "text/event-stream",
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
  };
  response.writeHead(200, headers);
  let qry1 = `SELECT team_member_sfids from labyrinth_SF WHERE Team_ID = ${request.body.Team_ID}`;
  mysql.query(qry1, (err, result) => {
    if (err) {
      result.json({
        code: -11,
        message: errslno.message,
      });
    } else {
      team_members = result[0].team_member_sfids;
    }
  });
  const data = `data: Correct`;

  response.write(data);

  for (sfid in team_members) {

    const newClient = {
      id: sfids,
      response,
    };
    team_members.push(newClient);
  }
  request.on("close", () => {
    console.log(`${clientId} Connection closed`);
    team_members = team_members.filter((client) => client.id !== request.body.SF_ID);
  });
}

function sendEventsToAll() {
  team_members.forEach((member) => member.response.write(`data: Correct`));
}
router.post("/updateTeam", middlewareComp, eventsHandler);
router.post("/", middlewareComp, (req, res) => {
  // req.body.qr_string = qr_string
  // req.body.Team_ID = tid
  const teamid = req.body.Team_ID;
  qind = "";
  qnind = `SELECT current_ques_no, question_order, wrong_attempts FROM current_status WHERE Team_ID = ${teamid}`;
  mysql.query(qnind, (errslno, dataslno) => {
    if (errslno) {
      res.json({
        code: -11,
        message: errslno.message,
      });
    } else {
      qind = dataslno[0].current_ques_no - 1;
      qo = dataslno[0].question_order;
      wrgattempt = dataslno[0].wrong_attempts;
      // if(qind<9){
      // Fetching current question id
      q1 = `SELECT current_ques_id FROM current_status WHERE Team_ID = ${teamid}`;
      mysql.query(q1, (err1, data) => {
        if (err1) {
          res.json({
            code: -1,
            message: err1.message,
          });
        } else {
          qid = data[0].current_ques_id;

          // Checking corrrect QR
          q2 =
            "SELECT question_id FROM labyrinth_questions WHERE question_id = ? AND qr_string = ?";
          mysql.query(q2, [qid, req.body.qr_string], (err2, data2) => {
            if (err2) {
              res.json({
                code: -2,
                message: err2.message,
              });
            } else {
              //If right QR scanned
              if (data2.length != 0) {
                // q3 = `SELECT question_order FROM current_status WHERE Team_ID = ?`
                // mysql.query(q3, [teamid], (err3, data3) => {
                // if (err3){
                //     res.json({
                //         code: -3,
                //         message: err3.message
                //     })
                // }
                // qo = dataslno[0].question_order;
                nextqid = qo[qind + 1];
                q4 =
                  "UPDATE current_status SET current_ques_id = ?, current_ques_no = ? WHERE Team_ID = ?";
                mysql.query(q4, [nextqid, qind + 2, teamid], (err4, data4) => {
                  if (err4) {
                    res.json({
                      code: -4,
                      message: err4.message,
                    });
                  } else {
                    res.status(200).json({
                      Status_code: 200,
                      code: 1,
                      question_id: nextqid,
                      message: "Updated question id Successfully",
                    });
                  }
                });

                // })
              }
              //If wrong QR scanned
              else {
                // res.json("False");

                //Increasing wrong attempts
                // q5 = `SELECT wrong_attempts FROM current_status WHERE Team_ID = ?`
                // mysql.query(q5, [teamid], (err5, data5) => {

                // if (err5) {
                //     console.log("err5",err5)
                //     res.json({
                //         code: -5,
                //         message: err5.message,
                //     });
                // }
                // else {
                // wrgattempt = dataslno[0].wrong_attempts
                console.log(dataslno[0]);
                if (wrgattempt > 10) {
                  res.json({
                    code: -8,
                    message: "You have exceeded the limit for wrong QR Scans",
                  });
                } else {
                  q6 = `UPDATE current_status SET wrong_attempts = ${
                    wrgattempt + 1
                  } WHERE Team_ID = ${teamid}`;
                  mysql.query(q6, (err6, data6) => {
                    if (err6) {
                      res.json({
                        code: -6,
                        message: err6.message,
                      });
                    } else {
                      return res.json({
                        Status_code: 200,
                        code: 2,
                        wrong_attempts: wrgattempt,
                        message: "Updated wrong attempts Successfully",
                      });
                    }
                  });
                }

                // }
                // })
              }
            }
          });
        }
      });
      // }
      // else{
      //     res.json({
      //         code:11,
      //         message:"You have finished the HUNT"
      //     })
      // }
    }
  });
});
module.exports = router;
