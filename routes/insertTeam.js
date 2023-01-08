
const express = require("express");
const router = express.Router();
const mysql = require("../database/connection.js").con;


router.post("/",(req,res)=>{
 const q="INSERT INTO current_status(Team_ID) VALUES (?)"
 const values=[
   req.body.Team_ID
 ]
 mysql.query(q,[values],(err,data)=>{
  if(err) console.log(err)
  return res.status(200).json("Registered Successfully")
 })

 
})
module.exports=router