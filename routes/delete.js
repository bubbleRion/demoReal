const conn = require("../mysql/database.js")
const express = require('express');
const router = express.Router();
const mysql = require("mysql")
const db = mysql.createConnection(conn);


router.post('/', (req, res)=>{
    let current = req.body.seq
    console.log(current)
    let sql = `delete from mainBoard10 where seq=${current};`
    db.query(`delete from comment where seq=${current};`, (err,results)=>{
      if(err){
        console.error(err)
      }
    })
    db.query(sql, (err, result)=>{
      if(err){
        console.error(err)
      }
      res.redirect("/board")
    })
  })

module.exports = router