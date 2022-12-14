const express = require('express');
const router = express.Router();

const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);

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
                <div class="logo">Way Home</div>
                <div class="sign">
                    <a href="/login" class="sign-in"><div>?????????</div></a>
                    <a href="signup" class="sign-up"><div>????????????</div></a>
                </div>
            </header>
            <main>
                <div class="img-box">
                    <img src="images/istockphoto-508423060-170667a.jpg" alt="" class="main-img">
                </div>
                <div class="text-box">
                    <form action="/idFind" method="post" class="form-box">
                        <input type="text" name="name" placeholder="??????" class="text-name">
                        <input type="text" name="email" placeholder="????????? ??????" class="text-email">
                        <input type="submit" value="????????? ??????" class="sbm">
                        <a href="/pwFind">???????????? ?????? ?????????</a>
                    </form>
                </div>
            </main>
        </div>
    </body>
    </html>`)
})


router.post("/", (req,res)=>{
    
    let body = req.body
    db.query("select * from userTable3" , (err, results)=>{
        if(err){
            console.error(err)
        }
        let result = results.map((items)=>{
            if(body.name == items.name && body.phone == items.phone){
                return items.id
            }   
        })
        let idResult = result.filter((data)=>{
            return data !== undefined
        })
        console.log(idResult)
        res.send(`<h1>???????????? ${idResult[0]}?????????.</h1><a href="/">???????????? ??????</a>`)
    })
})

module.exports = router