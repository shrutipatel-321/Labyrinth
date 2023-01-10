const express = require("express");
const app = express();
const router = express.Router();
const mysql = require("../database/connection.js").con;

const middlewareComp = (req, res, next)=>{
    q = "SELECT team_member_names from current_status WHERE Team_ID = ?"
    mysql.query(q, [req.body.Team_ID],(err,data)=>{
        if(err){
            res.json({
                code:-20,
                message:err.message
            })
        }
        else{
            if(data.length== 0){
                res.json({
                    code:-29,
                    message:"No Team with given Team ID"
                })
            }
            else{
                present = data[0].team_member_names.includes(req.body.SF_ID);
                if(present){
                    console.log(data)
                }
                else{
                    res.json({
                        code:-25,
                        message:"Team member not present in the team."
                    })
                }
            }
        }
    })
    next();
};

module.exports=middlewareComp;