const express = require('express');
const router = express.Router();
const myNaver = require("../mysql/naver.js")
const nodemailer = require("nodemailer")

const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);

const crypto = require("crypto")
const salt = 3.14102938777

const main = async(email, pw) =>{
    let transporter = nodemailer.createTransport(myNaver)
    let info = await transporter.sendMail({
        from : myNaver.auth.user,
        to: email,
        subject : `임시 비밀번호 전송해 드립니다.`,
        html : `<b>임시비밀번호: ${pw}</b>`
    })
    console.log('Message sent: %s', info.messageId);
   
}

router.get("/", (req, res)=>{
    res.send(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
            *{
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
    
            #root{
                width: 1920px;
                height: 1080px;
                background-color: #FFFFF0;
            }
    
            #root > header{
                width: inherit;
                height: 8vh;
                background-color: rgba(210, 105, 30, 0.6);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            #root > header > .logo{
                color: white;
                font-size: 48px;
                margin-left: 20px;
                text-decoration: none;
            }
    
            #root > header > .sign{
                display: flex;
                flex-direction: row;
            }
            #root > header > .sign > a{
                margin-right: 20px;
                text-decoration: none;
                color: #000;
            }
            #root > header > .sign > a > div{
                width: 130px;
                height: 50px;
                background-color: #fff;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 50px;
            }
            #root> main {
                width: inherit;
                height: 92vh;
                display: flex;
                
            }
            #root> main > div{
                width: 50vw;
                height: 92vh;
                display: flex;
                justify-content: center;
                align-items: center;
            }
            #root > main > .text-box > .form-box{
                display: flex;
                flex-direction: column;
            }
    
            #root > main > .text-box > .form-box > .text-name{
                background-color: transparent;
                border: none;
                border-bottom: 1px solid #CCC;
                width: 600px;
                height: 50px;
                margin-top: 50px;
                font-size: 24px;
            }
    
            #root > main > .text-box > .form-box > .text-id{
                background-color: transparent;
                border: none;
                border-bottom: 1px solid #CCC;
                width: 600px;
                height: 50px;
                margin-top: 50px;
                font-size: 24px;
            }
    
            #root > main > .text-box > .form-box > .text-email{
                background-color: transparent;
                border: none;
                border-bottom: 1px solid #CCC;
                width: 600px;
                height: 50px;
                margin-top: 50px;
                font-size: 24px;
            }
    
            #root > main > .text-box > .form-box > .sbm{
                all : unset;
                margin-top: 150px;
                display: flex;
                justify-content: center;
                width: 600px;
                height: 100px;
                border: 1px solid #000;
                border-radius: 50px;
                background-color: #fff;
            }
            #root > main > .text-box > .form-box > a{
                all : unset;
                margin-top: 50px;
                display: flex;
                justify-content: center;
                align-items: center;
                width: 600px;
                height: 100px;
                border: 1px solid #000;
                border-radius: 50px;
                background-color: #fff;
            }
            #root > main > .img-box > img{
                width: 700px;
                height: 800px;
            }
        </style>
        <title>Document</title>
    </head>
    <body>
        <div id="root">
            <header>
                <a href="/" class="logo">Way Home</a>
                <div class="sign">
                    <a href="/login" class="sign-in"><div>로그인</div></a>
                    <a href="/signup" class="sign-up"><div>회원가입</div></a>
                </div>
            </header>
            <main>
                <div class="img-box">
                    <img src="images/istockphoto-508423060-170667a.jpg" alt="" class="main-img">
                </div>
                <div class="text-box">
                    <form action="/pwFind" method="post" class="form-box">
                        <input type="text" name="name" placeholder="이름" class="text-name">
                        <input type="text" name="id" placeholder="아이디" class="text-id">
                        <input type="text" name="email" placeholder="이메일 주소" class="text-email">
                        <input type="submit" value="비밀번호 찾기" class="sbm">
                        <a href="/idFind">아이디 찾기 페이지</a>
                    </form>
                </div>
            </main>
        </div>
    </body>
    </html>`)
})

router.post("/", (req,res)=>{
    let randomPass = Math.floor((Math.random() + 1) * 12345678)
    console.log(randomPass)
    let saltPw =  "" +  randomPass * salt
    let hashPassword = crypto.createHash("sha512").update(saltPw).digest('base64')
    console.log(hashPassword)
    db.query(`select * from userTable3`, (err , results)=>{
        if(err){
            console.error(err)
        }
        results.forEach((items)=>{
            if(items.id == req.body.id && items.email == req.body.email){
                db.query(`UPDATE userTable3 SET password = "${hashPassword}" WHERE id = "${req.body.id}"`)

                main(req.body.email, randomPass)
            }
            else{
                console.log("회원정보가 일치하지 않습니다.")
            }
        })
    })

    res.redirect("/")
})

module.exports = router