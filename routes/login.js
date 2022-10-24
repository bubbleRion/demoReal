const path = require("path")
const express = require('express');
const router = express.Router();
const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);
// const jwt = require("jsonwebtoken")
let randomCookie = 0.18209
const sessionData = {}
const crypto = require("crypto");

const salt = 3.14102938777

const { LocalStorage } = require("node-localstorage");
const { copyFileSync } = require("fs");
let localStorage = new LocalStorage('./scratch')

let isLogin = false
let isAdmin = false

router.get("/",(req,res)=>{
    
    res.sendFile(path.join(__dirname, "../pages" ,"loginPage.html"))
})




router.post("/",(req,res)=>{
    
    let sql ="select * from userTable3;"
    
    let body = req.body;
    let id = body.id
    let password = body.password

    
    let result = false
    let userID = ""
    db.query(`select password from userTable3 where id = "${id}"`, (err, results)=>{
        console.log(results)
        if(results[0] == undefined){
            console.log("아이디 틀림")
        }
        else if(id == "admin"){
            isAdmin = true
        }
        else{
            let saltPw =  "" + body.password * salt
            let hashPassword = crypto.createHash("sha512").update(saltPw).digest('base64')
            if(results[0].password === hashPassword){
                isLogin = true
                userID = id
            }
            else{
                isLogin = false
                isAdmin = false
            }
        }
        // results.forEach((items)=>{
        //     // Admin, ghfjdhdl 는 Process.admin으로 교체 예정
        //     console.log(body.id)
        //     console.log(items.id)
        //     console.log(items.password)

        //     if(hashPassword == "RB36vQEmoz5Gd9dtc+TjQMWAXv31j+hL9KH3gV5nbw4Vm+dLLea+0X0f92b/HUkVygTLeBwMXQReHRSIbrHzHA==" && body.id == "admin"){
        //         isAdmin = true
        //     }


        //     if(body.id == items.id && hashPassword == items.password){
        //         isLogin = true
        //         userID = items.id
        //     }
        //     else{
        //         isLogin = false
        //         isAdmin = false
        //     }
        // })

        

        
        if(isLogin){
            console.log("로그인 성공")
            console.log(req.session)
            req.session.save()
            if(req.session){
                
                sessionData[req.sessionID] = {id, password}
                
                res
            .setHeader("Set-Cookie", `${req.sessionID}=${req.sessionID}; ${"id"}=${userID}; path=/`)
            .cookie("connect_id", `${userID}`, { maxAge: 30 * 60 * 1000 })
            .redirect("/")
            }
        }
        else if(isAdmin){
            console.log("관리자입니다.")
            sessionData[req.sessionID] = {id, password}
            localStorage.setItem("admin", res.header)
            res
            .setHeader("Set-Cookie", `${req.sessionID}=${req.sessionID}; path=/`)
            .cookie("connect_Admin", `${req.sessionID}`, { maxAge: 5000 })
            .redirect("/admin")
        }
        else{
            console.log("로그인 실패")
            res.redirect("/")
        }
    })
})


module.exports = {
    router,
    isLogin
}