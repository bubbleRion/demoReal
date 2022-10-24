const express = require('express');
const router = express.Router();

const conn = require("../mysql/database.js")
const mysql = require("mysql")
const db = mysql.createConnection(conn);

const imageURL = "http://www.daejeon.go.kr/"

router.get('/', async (req, res) => {
  
  
  // console.log(dbData[0].animalSeq, dbData[4].animalSeq)
  let adoption = ""
  let gender = ""
    if(req.query.result == "공고중"){
        adoption = "1"
    }
    else if(req.query.result == "입양가능"){
        adoption = "2"
    }
    else if(req.query.result == "입양예정"){
        adoption = "3"
    }
    else if(req.query.result == "입양완료"){
        adoption = "4"
    }
    else if(req.query.result == "주인반환"){
        adoption = "7"
    }
    else{
      // 더미문자
      adoption = "ksajfiapshgfiaznfkwa"
    }
    if(req.query.result == "암컷"){
        gender = "1"
    }
    else if(req.query.result == "수컷"){
        gender = "2"
    }
    else{
      // 더미문자
      gender = "sakfhioashfnwakfnwaf"
    }

    
  db.query(`select * from lostBoard where adoptionStatusCd like "%${adoption}%" or age like "%${req.query.result}%" or gender like "%${gender}%" or breed like "%${req.query.result}%"  or animalSeq like "%${req.query.result}%" or foudPlace like "%${req.query.result}%" or memo like "%${req.query.result}%";`, (err, results)=>{
    if(err){
      console.error(err)
    }
    let fileImages = ""
    if(req.query.result.length > 1){
       fileImages = results.reverse().map((values, index)=>{
       
        let image = values.filePath === "" ? "/uploads/1666313512904.jpg" : imageURL + values.filePath
            return `
            <a href="lostBoard${values.animalSeq}"><img alt="이미지 준비중" src="${image}"/><a>`
        })
    }
    
          
        
      
  
    let images = ""
    const set = new Set(fileImages)
        let fileImage = [...set]
        fileImage.forEach((item)=>{
          images += item
        })


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
      ${images === "" ? "<h1>검색결과 없네요!</h1>" : images}
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


  })
})
module.exports = router;