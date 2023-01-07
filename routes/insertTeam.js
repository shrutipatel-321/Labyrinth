import con from "../database/connection"
const express = require("express");
const router = express.Router();
const mysql = require("../database/connection").con;


router.post("/",(req,res)=>{
 const q="INSERT INTO current_status(`Team_ID`,`team_member_names`) VALUES(?)"
 const values=[
   req.body.Team_ID,
   req.body.team_member_names
 ]
 con.query(q,[values],(err,data)=>{
  if(err) console.log(err)
  return res.status(200).json("Registered Successfully")
 })
 
})