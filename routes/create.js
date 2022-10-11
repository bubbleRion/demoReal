const conn = require("../mysql/database.js")
const express = require('express');
const router = express.Router();
const mysql = require("mysql")
const db = mysql.createConnection(conn);
const middle = require("./template/middleWare.js")
let realCount = 300;

router.get("/", (req, res)=>{
    db.query("select * from mainBoard4", (err, results)=>{
        realCount = middle.realCount(results[results.length -1].seq)
    })
    res.send(`<!DOCTYPE html>
    <html lang="en">
    ​
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    ​
    <body>
      <h1>글 작성하기</h1>
      <h1><a href="/" style="color: black; text-decoration: none; position: absolute; right: 0; top: 20px;">글 작성 취소</a></h1>
      <form action="/create" method="post"
        style="display: flex; justify-content : center; align-items: center; flex-direction: column;">
        <input type="text" name="headText" placeholder="제목" style="width: 700px; height : 20px"><br>
        <input type="text" name="mainTag" placeholder="태그" style="width: 700px; height : 20px"><br>
        <textarea type="text" name="mainText" placeholder="본문" style="width: 700px; height : 600px;"></textarea><br>
        <button type="submit" style="width: 140px; height: 60px; font-size: 24px;">작성하기</button>
      </form>
    </body>
    ​
    </html>`)
  })

  // 게시글 처리 과정 req로 받아서 디비에 저장을 한다. 
router.post("/", (req, res)=>{
let body = req.body
let headText = body.headText;
let mainTag = body.mainTag;
let mainText = body.mainText





let query = db.query(`insert into mainBoard4(seq, head, tag, main) values("${(realCount)}", "${headText}", "${mainTag}", "${mainText}" );`,  (err)=>{
    if(err){
    console.error(err)
    }
})

res.redirect("/board")
})

module.exports = router;