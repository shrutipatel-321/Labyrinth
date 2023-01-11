const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;



router.get("/", (req,res)=>{
    
    
        let qry = `select Sl_no, Team_ID,current_ques_no,team_member_names from current_status order by current_ques_no desc limit 3`;
        mysql.query(qry, (err, result) => {
          
          if (err) {
            res.send({
              code: -1,
              message: err.message,
            });
          } else {
            let newResult = result.map((ele)=>{
            //   ele.SF_ID="SF"+ele.SF_ID
              
              return (ele)
            })
            res.send({
              code: 5,
              message: "These are the users with top scores",
              Top_users: newResult,
            });
          }
        });
      });


module.exports=router;