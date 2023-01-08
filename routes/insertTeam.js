const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;
const axios=require("axios")



router.post("/", (req, res) => {
  var events=[];
  const token=req.token;
 res.send(token)
    
      axios.post("https://mainapi.springfest.in/api/user/get_registered_events",{token:token})
      .then((res)=>{
         events=res.data.message.group;
         console.log(events);
         const event=events.filter((item)=>{
          item.event_name=="Centrifuge"
      })
      // console.log(event);
      const Team_ID= (event[0]?.group_id);
      const members=(event[0]?.members);
      const team_member_names=[];
      const team_member_sfids=[];
      members.map((item)=>{
             team_member_names.push(item.member_name)
             team_member_sfids.push(item.member_sfid)
      })
      })
      .catch((err)=>{
        console.log(err)
      })
    
    
  
    

  const q = "INSERT INTO current_status(Team_ID,team_member_names,team_member_sfids) VALUES (?)";
  const values = [
    Team_ID,
    team_member_names,
    team_member_sfids
  ];
  mysql.query(q, [values], (err, data) => {
    if (err) {
      console.log(err);
      return res.send({
        code: -2,
        message: err.message,
      });
    } else {
      return res.status(200).send({
        code:0,
        message:"Registration successfull",
      });
    }
  });
});


module.exports = router;
