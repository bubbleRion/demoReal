
const express = require('express');
const router = express.Router();
const fetch = require("node-fetch")

const convert = require("xml-js")


const URL = "http://apis.data.go.kr/6300000/animalDaejeonService/animalDaejeonList"

const EncodingKEY = "aabdjVtDyODuXtGkvJfA7GEEAE%2B7oKgHMt3Vs2z1iZZy%2Fh0S9KF7iOxPZFyyqKg28lO9bKPRcx3WzJxQtZnlXg%3D%3D"

const DecondingKEY = "aabdjVtDyODuXtGkvJfA7GEEAE+7oKgHMt3Vs2z1iZZy/h0S9KF7iOxPZFyyqKg28lO9bKPRcx3WzJxQtZnlXg=="

const queryParams = '?' + encodeURIComponent('serviceKey') + '=' + EncodingKEY;

router.get('/', async (req, res) => {
  const datas = await fetch(URL + queryParams + "&numOfRows=10&pageNo=2")
  const data = await datas.text()
  let result = convert.xml2json(data, {compact  :true, spaces  :4})
  const imageURL = "http://www.daejeon.go.kr/"

  const filePaths = JSON.parse(result)
  const filePath = Object.values(filePaths)[1].MsgBody.items.map((values)=>{
    return `
    <img style="width : 250px; height : 350px; " src="${imageURL + values.filePath._text}"/>`
  })
  const images = filePath.join("")
  
  
// 보내준다. 데이터를 담은 html
res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <link rel="stylesheet" href="/lostBoard.css">
</head>
<body>
  <div id="root">
    <header>
      <div class="logo">
        <a href="/"><img src="images/로고.png" alt="" class="img"></a>
      </div>
      <div class="name">
        <div><a href="/lostBoard">유기 반려 동물 개시판</a></div>
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
    <a href="/board" class="leftbt">실종 동물 페이지</a>
    <a href="/" class="rightbt">글 쓰 기</a>
    </div>
      <div id="section">
      ${images}
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