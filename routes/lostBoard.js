
const express = require('express');
const router = express.Router();

const fetch = require("node-fetch")

const URL = "http://apis.data.go.kr/6300000/eventDataService/eventDataListJson"

const EncodingKEY = "aabdjVtDyODuXtGkvJfA7GEEAE%2B7oKgHMt3Vs2z1iZZy%2Fh0S9KF7iOxPZFyyqKg28lO9bKPRcx3WzJxQtZnlXg%3D%3D"


const queryParams = '?' + encodeURIComponent('serviceKey') + '=' + EncodingKEY;

router.get('/', async (req, res) => {
  const datas = await fetch(URL + queryParams)
  const data = await datas.json()
  let {contents} = data
  
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
      <input type="search" name="result" class="inputSearch">
      <a>
        <img src="images/검색.png" alt="">
      </a>
    </form>
  </div>
    </sidebar>
    <main>
      <div id="menu">
        <button class="leftbt">유기 동물 페이지</button>
        <form action="http://localhost:8000/createboard" method="get">
          <button class="rightbt" formaction="http://localhost:8000/createboard">글 쓰 기</button>
        </form>
      </div>
      <div id="section">
        ${contents}
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
});
 
module.exports = router;