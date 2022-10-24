
const express = require('express');
const router = express.Router();
const fetch = require("node-fetch")

const convert = require("xml-js")

const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);

const URL = "http://apis.data.go.kr/6300000/animalDaejeonService/animalDaejeonList"

const EncodingKEY = require("../mysql/key.js")


const queryParams = '?' + encodeURIComponent('serviceKey') + '=' + EncodingKEY;

router.get('/', async (req, res) => {
  const datas = await fetch(URL + queryParams + "&numOfRows=10&pageNo=1")
  const data = await datas.text()
  let result = convert.xml2json(data, {compact  :true, spaces  :4})
  const imageURL = "http://www.daejeon.go.kr/"

  const filePaths = JSON.parse(result)
  const file = Object.values(filePaths)[1]
  let dbData = null
  if(file.MsgBody !== undefined){
  dbData = file.MsgBody.items.map((values)=>{
    let adoption = values.adoptionStatusCd === undefined ? "" : values.adoptionStatusCd._text
    let age = values.age === undefined ? "" : values.age._text
    let animalSeq = values.animalSeq === undefined ? "" : values.animalSeq._text
    let filePath = values.filePath === undefined ? "" : values.filePath._text
    let foundPlace = values.foundPlace === undefined ? "" : values.foundPlace._text
    let gender = values.gender === undefined ? "" : values.gender._text
    let memo = values.memo === undefined ? "" : values.memo._text
    let breed = values.species ===undefined ? "" : values.species._text
    let apiData = {}
    if(filePath !== undefined){
      apiData = {
        adoption,
        age,
        animalSeq,
        filePath,
        foundPlace,
        gender,
        memo,
        breed
      }
    }
    else{
      apiData = ""
    }
    
    return apiData
  })
}
  // console.log(dbData[0].animalSeq, dbData[4].animalSeq)


  db.query(`select animalSeq , adoptionStatusCd from lostBoard`, (err, results)=>{
    results.sort((a,b)=>{
      return Number(b.animalSeq) - Number(a.animalSeq)
    })

    // console.log(results[0].animalSeq)
    // console.log(results)
    // console.log(dbData)
    dbData.sort((a,b)=>{
      return Number(b.animalSeq) - Number(a.animalSeq)
    })
    // console.log(dbData[0].animalSeq)
    let newData = dbData.filter((item, index)=>{
      return Number(item.animalSeq) > Number(results[0].animalSeq)
    })
    let adoptionData = dbData.filter((item, index)=>{
      return Number(item.adoption) !== Number(results[index].adoptionStatusCd)
    })
    // 새로운 데이터 추가
    if(newData[0] !== undefined){
      console.log("데이터 추가")
      overRiding(newData)
    }
    // adoption의 유기현환 업데이트
    if(adoptionData[0] !== undefined){
      console.log("adoptionStatusCd update")
      adoptionUpdate(adoptionData)
    }
  
  })

  db.query(`select * from lostBoard`, (err, results)=>{
    if(err){
      console.error(err)
    }
    results.sort((a,b)=>{
      return Number(b.animalSeq) - Number(a.animalSeq)
    })

    let fileImage = results.map((values, index)=>{
      // index = 44 

      let image = values.filePath === "" ? "/uploads/1666313512904.jpg" : imageURL + values.filePath
      
      return `
      <a href="lostBoard${values.animalSeq}"><img alt="이미지 준비중" src="${image}"/><a>`
    
    })
    
    const images = fileImage.join("")
    let privateKey = req.headers.cookie
  
    if(privateKey !== undefined){
      let [session , cookie] = privateKey.split(";");
    // cookie가 1시간이 지나면 사라지므로 undefined가 나올 수 있다. 그 때는 아이디정보가 사라지게 하기 위해 조건을 달음
    if(cookie !== undefined){
      let [connectID, userStatus] = cookie.split("=")
      // 가끔씩 cookie와 session정보의 위치가 뒤바뀌어 나오는 경우가 있다. 그 때를 위해서 아이디 제한 12자이하으로 치부하고 글자수로 구분
      if(userStatus.length <= 12){
        userID = userStatus;
      }
      else{
        // 위치가 뒤바뀌면 session에 회원정보가 담기게 되므로 세션에서 뒤에 아이디를 담아준다.
        let [, userStat] = session.split("=");
        userID = userStat;
      }
      // 쿠키 정보가 사라졌을 때의 조건
      // privateKey를 null처리 해주고 userID도 빈값으로 다시 바꾸어준다.
    }else{
      userID = "";
      res.clearCookie(privateKey)
      delete session[privateKey]
    }
  }

  let text = `<a href="/login" class="signIn">로그인</a>`
  if(privateKey){
    text = `<a href="/logout" class="signIn">로그아웃</a>`
  }
// 보내준다. 데이터를 담은 html
res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<link rel="stylesheet" href="board2.css">
<body>
  <div id="root">
    <header>
      <!-- 맨위에 긴박스 -->
      <a href="/">Way Home</a>
      <div>
        ${text}
      </div>
      <div>
        <a href="">회원가입</a>
      </div>
    </header>
    <div>유기 동물 페이지</div>
    <div>
    <a href="/board">실종동물</a>
    </div>
    <div>
      <form action="/lostSearchPage" method="get">
        <input class="search-txt" type="text" name="result" placeholder="검색어를 입력해 주세요">
      </form>
    </div>
    <main>
    <!-- 가운데 10개 박스감싸는 박스 -->
      ${images}
    </main>
    <div class="left">
      <img src="../../public/board/화살표 (2).png" alt="">
    </div>
    <div class="right">
      <img src="../../public/board/화살표 (2).png" alt="">
    </div>
  </div>
</body>
</html>`)
});

  })
  let isLogin = false
  
  
//  새로운 데이터 추가 해주는 함수
function overRiding(obj){
  obj.forEach((items)=>{
    db.query(`insert into lostBoard(adoptionStatusCd, age, animalSeq, breed, filePath, foudPlace, gender, memo) values(${items.adoption}, "${items.age}", "${items.animalSeq}", "${items.breed}", "${items.filePath}", "${items.foundPlace}", "${items.gender}", "${items.memo}")` ,(err, results)=>{
      if(err){
        console.error(err)
      }
    })
  })
}
// adoption 업데이트 해주는 함수
function adoptionUpdate(obj){
  obj.forEach((item)=>{
    db.query(`update lostBoard set adoptionStatusCd =${item.adoption} where animalSeq=${item.animalSeq}` , (err, results)=>{
      if(err){
        console.error(err)
      }
    })
  })
}



module.exports = router;