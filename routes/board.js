const conn = require("../mysql/database.js")
const express = require('express');
const router = express.Router();
const mysql = require("mysql")
const db = mysql.createConnection(conn);



router.get('/', (req, res) => {
  let result = "";
  
  db.query("select * from mainBoard4", (err, results)=>{
    if(err){
      console.error(err)
    }
    // realCount의 값을 바꿔준다. 게시물 번호 마지막의 +1
    result =  results.reverse().map((item, index)=>{
      
      return `<a href="/board${item.seq}"><div class="list"><div class="text">${item.seq} : ${item.head}</div></div></a>
      `
    })
    let result2 = ""
    result.forEach((item)=>{
      result2 += item
    })
// 보내준다. 데이터를 담은 html
res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="/board.css">
</head>
<body>
  <div id="root">
    <header>
      <div class="logo">
        <a href="/"><img src="images/로고.png" alt="" class="img"></a>
      </div>
      <div class="name">
        <div><a href="/board">실종 반려 동물 개시판</a></div>
      </div>
      <div class="login">
        <button class="signUp">회원가입</button>
        <button class="signIn">로그인</button>
      </div>
    </header>
    <sidebar id="sidebar">
    <div class="search">
    <form action="/searchPage" method="get">
      <input type="search" name="result" class="inputSearch" placeholder="실종 동물 검색">
      <a>
        <img src="images/검색.png" alt="">
      </a>
    </form>
  </div>
    </sidebar>
    <main>
      <div id="menu">
        <a href="/lostBoard" class="leftbt">유기 동물 페이지</a>
        <a href="/create" class="rightbt">글 쓰 기</a>
      </div>
      <div id="section">
        ${result2}
      </div>
      <div class="pagenation">
        <p><</p>
        <p>1</p>
        <p>2</p>
        <p>3</p>
        <p>4</p>
        <p>5</p>
        <p>6</p>
        <p>7</p>
        <p>8</p>
        <p>9</p>
        <p>></p>
      </div>
    </main>
  </div>
</body>
</html>`)
  })
});
 
module.exports = router;