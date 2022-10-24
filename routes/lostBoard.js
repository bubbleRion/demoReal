// 모듇 express 가져오기
const express = require('express');
// express router 호출
const router = express.Router();
// node fetch 가져오기
const fetch = require("node-fetch")
// xmlToJson 가져오기
const convert = require("xml-js")
// 내 db정보 가져오기
const conn = require("../mysql/database.js")
// 모듈 mysql 가져오기
const mysql = require("mysql")
// db정보를 mysql에 넣어서 query 사용하게끔 처리
const db = mysql.createConnection(conn);
// api주소
const URL = "http://apis.data.go.kr/6300000/animalDaejeonService/animalDaejeonList"
// 깃허브에 올라가지 못하도록 처리한 나의 시리얼 키
const EncodingKEY = require("../mysql/key.js")

// 쿼리 파람스, api주소와 시리얼 키를 연결
const queryParams = '?' + encodeURIComponent('serviceKey') + '=' + EncodingKEY;


  // api 게시글 전체를 업데이트 하기위한 변수
let pageCountNum = 1

router.get('/', async (req, res) => {
  
  const datas = await fetch(URL + queryParams + `&numOfRows=10&pageNo=${pageCountNum}`)
  const data = await datas.text()
  let result = convert.xml2json(data, {compact  :true, spaces  :4})
  const imageURL = "http://www.daejeon.go.kr/"

  const filePaths = JSON.parse(result)
  const file = Object.values(filePaths)[1]
  let dbData = null
  // api가 업데이트 중일 때에는 특이하게 undefined가 나올 때가 있다. 그때에는 동작하지 못하도록 처리
  if(file !== undefined){
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


  db.query(`select animalSeq , adoptionStatusCd , filePath from lostBoard`, (err, results)=>{
    results.sort((a,b)=>{
      return Number(b.animalSeq) - Number(a.animalSeq)
    })
    
  // api가 업데이트 중일 때에는 특이하게 null이 나올 때가 있다. 그때에는 동작하지 못하도록 처리
  // 언디파인드와 null이 아닐때에만 데이터 생성, db에 추가하거나 업데이트
    if(dbData !== undefined && dbData !== null){
    
      dbData.sort((a,b)=>{
        return Number(b.animalSeq) - Number(a.animalSeq)
      })
      // dbData에서 새로운 seq번호가 나왔을 때 newData에 담는다.(add)
      let newData = dbData.filter((item, index)=>{
        return Number(item.animalSeq) > Number(results[0].animalSeq)
      })
      // db데이터에서 db와 다른 부분이 있을 때 adoptionData에 담는다. (update) 
      let adoptionData = dbData.filter((item, index)=>{
        return Number(item.adoption) !== Number(results[index + (pageCountNum -1) * 10].adoptionStatusCd)
      })
      // db데이터에서 db와 다른 부분이 있을 때 fileImageData에 담는다. (update) 
      let fileImageData = dbData.filter((item, index)=>{
        return item.filePath !== results[index + (pageCountNum -1) * 10].filePath
      })
      // 새로운 데이터 추가
      if(newData[0] !== undefined){
        console.log("데이터 추가")
        overRiding(newData)
      }

      // api게시글 전체를 업데이트 하기 위한 처리 페이지가 리로드 될 때마다 pageCountNum을 1씩 증가 시킨다.  
        pageCountNum++
        // console.log(pageCountNum)
        // pageCountNum은 1부터 시작하여 4로 끝난다. 4이상일 때 1로 초기화 해준다.
        if(pageCountNum > 3){
          pageCountNum = 1
        }
      // adoption의 유기현황 업데이트
      if(adoptionData[0] !== undefined){
        console.log("adoptionStatusCd update")
        adoptionUpdate(adoptionData)
      }
      // filePath 이미지 경로 업데이트
      if(fileImageData[0] !== undefined){
        console.log("filePath 업데이트")
        filePathUpdate(fileImageData)
      }
    }
  })
// 로스트 보드를 선택하고, 이미지 출력을 위하여.
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
// adoption(유기현황) 업데이트 해주는 함수
function adoptionUpdate(obj){
  obj.forEach((item)=>{
    db.query(`update lostBoard set adoptionStatusCd ="${item.adoption}" where animalSeq=${item.animalSeq}` , (err, results)=>{
      if(err){
        console.error(err)
      }
    })
  })
}
// 사진경로 업데이트 해주는 함수
function filePathUpdate(obj){
  obj.forEach((item)=>{
    db.query(`update lostBoard set filePath="${item.filePath}" where animalSeq=${item.animalSeq}` , (err, results)=>{
      if(err){
        console.error(err)
      }
    })
  })
}


module.exports = router;