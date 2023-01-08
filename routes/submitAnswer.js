const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;

router.post("/", (req, res) => {
    // req.body.qr_string = qr_string
    // req.body.Team_ID = tid

    const teamid = req.body.Team_ID;
    slno = "";
    qslno = `SELECT Sl_no FROM current_status WHERE Team_ID = ${teamid}`;
    mysql.query(qslno, (errslno, dataslno) => {
        if (errslno) console.log("qslno", errslno)
        else {
            slno = dataslno[0].Sl_no;
        }
    })
    
    // Fetching current question id
    q1 = `SELECT current_ques_id FROM current_status WHERE Team_ID = ${teamid} AND Sl_no=${slno}`
    mysql.query(q1, (err1, data) => {
        if (err1)
        {
            console.log("query1", err1)
        } 
        else {
            qid = data[0].current_ques_id;
            console.log(data[0].current_ques_id);

            // Checking corrrect QR
            q2 = "SELECT qr_string FROM labyrinth_questions WHERE question_id = ?"
            mysql.query(q2, [qid], (err2, data2) => {
                if (err2) console.log("query2", err2)
                else {
                    //If right QR scanned
                    if (data2[0].qr_string === req.body.qr_string) {
                        q3 = `SELECT question_order FROM current_status WHERE Team_ID = ? AND Sl_no=${slno}`
                        mysql.query(q3, [teamid], (err3, data3) => {
                            if (err3) console.log("query3", err3)
                            const qo = data3[0].question_order;
                            nextqid = "";
                            for (i = 0; i < qo.length; i++) {
                                if (qo[i] == qid) {
                                    nextqid = qo[i + 1]
                                    q4 = "UPDATE current_status SET current_ques_id = ? WHERE Team_ID = ? AND Sl_no=?"
                                    mysql.query(q4, [nextqid, teamid, slno], (err4, data4) => {
                                        if (err4) console.log("query4", err4)
                                        else return res.status(200).json("Update question id Successfully")
                                    })
                                }
                            }
                        })
                    }
                    //If wrong QR scanned
                    else {
                        res.json("False");

                        //Increasing wrong attempts
                        q5 = `SELECT wrong_attempts FROM current_status WHERE Team_ID = ? AND Sl_no = ${slno}`
                        res.json(q5)
                        mysql.query(q5, [teamid], (err5, data5) => {
                            res.json(data5)
                            if (err5) {
                                res.send({
                                    code: -1,
                                    message: err5.message,
                                });
                            }
                            else {
                                wrgattempt = data5[0].wrong_attempts
                                if (wrgattempt >= 10) {
                                    res.send({
                                        code: -2,
                                        message: "You have exceeded the limit for wrong QR Scans"
                                    })
                                }
                                else {
                                    q6 = "UPDATE current_status SET wrong_attempts = ? WHERE Team_ID = ? AND Sl_no=?"
                                    mysql.query(q5, [(wrgattempt+1),teamid, slno], (err6, data6) => {
                                        if (err6) console.log(err6)
                                        else return res.status(200).json("Update wrong attempts Successfully")
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }

    })
})
module.exports=router;