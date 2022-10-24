const path = require("path")
const express = require('express');
const router = express.Router();
const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);
const crypto = require("crypto")
const salt = 3.14102938777
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname  ,"../pages" , "signupPage.html"))
});
 
router.post("/", (req,res)=>{
    let body = req.body;
    
    let saltPw = "" + body.password * salt
    let hashPassword = crypto.createHash("sha512").update(saltPw).digest('base64')
    if(body.id !== "" && body.name !== "" && hashPassword !== "" && body.phone !== ""){
      let newUser = db.query(`insert into userTable3(id,name,address,phone,password, email) values("${body.id}","${body.name}","${body.address}","${body.phone}","${hashPassword}" , "${body.email}");`, (err, rows)=>{
        if(err){
          console.error(err);
        }
      })
    }
    else{
      console.log("입력 해야함")
    }
    
      res.redirect("/")

})
module.exports = router;