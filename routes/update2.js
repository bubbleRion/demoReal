const conn = require("../mysql/database.js")
const express = require('express');
const router = express.Router();
const mysql = require("mysql")
const db = mysql.createConnection(conn);

router.post("/", (req , res)=>{
    let body = req.body
    let current = Number(body.seq)
    console.log(current)
    let sql = `update mainBoard10 set location = "${body.location}", breed = "${body.breed}", gender = "${body.gender}", age = "${body.age}", isNeutering = "${body.isNeutering}", name = "${body.name}", uniqueness = "${body.uniqueness}" , userID = "${body.userID}" where seq=${current};`
    db.query(sql, (err, result)=>{
      if(err){
        console.error(err)
      }

      res.redirect(`/board${current}`)
    })
  })

  module.exports = router
