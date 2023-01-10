const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;
const middlewareComp = require('../middleware/middleware')

router.post("/",middlewareComp, (req, res) => {
    // req.body.qr_string = qr_string
    // req.body.Team_ID = tid

    const teamid = req.body.Team_ID;
    qind = "";
    qnind = `SELECT question_index FROM current_status WHERE Team_ID = ${teamid}`;
    mysql.query(qnind, (errslno, dataslno) => {
        if (errslno){ 
            res.json({
                code:-11,
                message:errslno.message
            })
        }
        else {
            if(dataslno.length == 0){
                return res.json({
                    code:-10,
                    message:"No Team with given Team ID"
                })
            }
            else{
                qind = dataslno[0].question_index; 
                if(qind<9){
                    // Fetching current question id
                    q1 = `SELECT current_ques_id FROM current_status WHERE Team_ID = ${teamid}`
                    mysql.query(q1, (err1, data) => {
                        if (err1)
                        {
                            res.json({
                                code:-1,
                                message: err1.message
                            })
                        } 
                        else {
                            qid = data[0].current_ques_id;
                            console.log(data[0].current_ques_id);
    
                            // Checking corrrect QR
                            q2 = "SELECT qr_string FROM labyrinth_questions WHERE question_id = ?"
                            mysql.query(q2, [qid], (err2, data2) => {
                                if (err2){
                                    res.json({
                                        code: -2,
                                        message: err2.message
                                    })
                                } 
                                else {
                                    //If right QR scanned
                                    if (data2[0].qr_string === req.body.qr_string) {
                                        q3 = `SELECT question_order FROM current_status WHERE Team_ID = ?`
                                        mysql.query(q3, [teamid], (err3, data3) => {
                                            if (err3){
                                                res.json({
                                                    code: -3,
                                                    message: err3.message
                                                })
                                            }
                                            qo = data3[0].question_order;
                                            nextqid = qo[qind +1];
                                            q4 = "UPDATE current_status SET current_ques_id = ?, question_index = ? WHERE Team_ID = ?"
                                            mysql.query(q4, [nextqid, qind + 1, teamid], (err4, data4) => {
                                                if (err4){
                                                    res.json({
                                                        code:-4,
                                                        message: err4.message
                                                    })
                                                }
                                                else{
                                                    res.status(200).json({
                                                    Status_code : 200,
                                                    code: 1,
                                                    message:"Update question id Successfully"
                                                    })
                                                } 
                                            })
                                                
                                            
                                        })
                                    }
                                    //If wrong QR scanned
                                    else {
                                        // res.json("False");
    
                                        //Increasing wrong attempts
                                        q5 = `SELECT wrong_attempts FROM current_status WHERE Team_ID = ?`
                                        mysql.query(q5, [teamid], (err5, data5) => {
                                            
                                            if (err5) {
                                                console.log("err5",err5)
                                                res.json({
                                                    code: -5,
                                                    message: err5.message,
                                                });
                                            }
                                            else {
                                                wrgattempt = data5[0].wrong_attempts
                                                console.log(data5[0])
                                                if (wrgattempt >= 10) {
                                                    res.json({
                                                        code: -8,
                                                        message: "You have exceeded the limit for wrong QR Scans"
                                                    })
                                                }
                                                else {
                                                    q6 = `UPDATE current_status SET wrong_attempts = ${wrgattempt+1} WHERE Team_ID = ${teamid}`
                                                    mysql.query(q6, (err6, data6) => {
                                                        if (err6){
                                                            res.json({
                                                                code:-6,
                                                                message: err6.message
                                                            })
                                                        }
                                                        else{
                                                            return res.json({
                                                                Status_code : 200,
                                                                code: 2,
                                                                message:"Updated wrong attempts Successfully"
                                                            })
                                                        }
                                                    })
                                                }
                                            
                                            }
                                        })
                                    }
                                }
                            })
                        }
    
                    })
                }
                else{
                    res.json({
                        code:11,
                        message:"You have finished the HUNT"
                    })
                }
            }
        }
    })
    
})
module.exports=router;