const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;
const axios = require("axios");

router.post("/", (req, res) => {
  var events = [];
  const token = req.token;
  var Team_ID = "";
  var allmembers = [];
  var team_member_names = [];
  var team_member_sfids = [];

  axios
    .post("https://mainapi.springfest.in/api/user/get_registered_events", {
      token: token,
    })
    .then((response) => {
      if (response.data.code == 0) {
        events = response.data.message.group;
        console.log(events);
        const event = events.filter((item) => {
          item.event_name === "Centrifuge";
        });
        // console.log(event);
        Team_ID = event[0]?.group_id;
        allmembers = event[0]?.members;

        allmembers.map((item) => {
          team_member_names.push(item.member_name);
          team_member_sfids.push(item.member_sfid);
        });
        const last_updated=new Date().getMinutes();

        const q =
          "INSERT INTO current_status(Team_ID,wrong_attempts,last_updated,team_member_names,team_member_sfids) VALUES (?)";
        const values = [Team_ID,10,last_updated, team_member_names, team_member_sfids];
        mysql.query(q, [values], (err, data) => {
          if (err) {
            console.log(err);
            return res.send({
              data:{
                code: -2,
                message: err.message,
              }
            });
          } else {
            return res.status(200).send({
             data:{
              code: 0,
              message: "Registration successfull",
              
             } 
            });
          }
        });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

module.exports = router;
