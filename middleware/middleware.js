const express = require("express");
const app = express();
const router = express.Router();
const mysql = require("../database/connection.js").con;

const middlewareComp = (req, res, next)=>{
    q = "SELECT team_member_sfids from current_status WHERE Team_ID = ?"
    mysql.query(q, [req.body.Team_ID],(err,data)=>{
        if(err){
            return res.json({
                code:-20,
                message:err.message
            })
        }
        else{
            if(data.length== 0){
                return res.json({
                    code:-29,
                    message:"No Team with given Team ID"
                })
            }
            else{
                console.log(data)
                present = data[0].team_member_sfids.includes(req.body.SF_ID);
                // console.log(data[0].team_member_names)
                // console.log(present);
                if(present){
                    q4 = `SELECT current_ques_no FROM current_status WHERE Team_ID = ${req.body.Team_ID}`;
                    mysql.query(q4,(err2,data2)=>{
                        if(err2){
                            res.json({
                                code:-33,
                                message:err2.message
                            })
                        }
                        else{
                            if(data2[0].current_ques_no < 10){
                                next();
                            }
                            else{
                                return res.status(200).json({
                                    Status_code : 200,
                                    code: 1,
                                    message:"You have completed the HUNT."
                                })
                            }
                        }
                    })
                    
                }
                else{
                    return res.json({
                        code:-25,
                        message:"Team member not present in the team."
                    })
                }
            }
        }
    })
};

module.exports=middlewareComp;